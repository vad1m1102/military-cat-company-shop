import { useEffect, useRef, useState } from "react";

export default function CategoryNav({ items }) {
  const [active, setActive] = useState(items?.[0]?.id ?? "");

  const barRef = useRef(null);
  const btnRefs = useRef({});

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean);

    // 🔎 якщо якась секція не знайдена — вона НІКОЛИ не підсвітиться
    if (sections.length !== items.length) {
      const found = new Set(sections.map((s) => s.id));
      const missing = items.filter((i) => !found.has(i.id)).map((i) => i.id);
      console.warn("Missing section ids:", missing);
    }

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // беремо найвидимішу секцію
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (best?.target?.id) setActive(best.target.id);
      },
      {
        threshold: [0.05, 0.15, 0.25, 0.35],
        // зона “активності” зміщена вниз, щоб sticky nav не заважав
        rootMargin: "-15% 0px -70% 0px",
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  // ✅ плавний автоскрол категорій
  useEffect(() => {
    const bar = barRef.current;
    const btn = btnRefs.current?.[active];
    if (!bar || !btn) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // поточний scrollLeft контейнера + позиція кнопки всередині контейнера
    const btnCenter =
      (btnRect.left - barRect.left) + bar.scrollLeft + btnRect.width / 2;

    const targetLeft = Math.max(0, btnCenter - barRect.width / 2);

    bar.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [active]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="sticky top-3 z-40 px-6">
      <div className="mx-auto max-w-6xl">
        <div
          ref={barRef}
          className="rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg px-2 py-2 overflow-x-auto"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            {items.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  ref={(node) => {
                    if (node) btnRefs.current[c.id] = node;
                  }}
                  type="button"
                  onClick={() => scrollTo(c.id)}
                  className={[
                    "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                    "border shrink-0",
                    isActive
                      ? "bg-primary text-black border-primary"
                      : "bg-transparent text-white/75 border-white/10 hover:border-primary/60 hover:text-primary",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
