import { useEffect, useMemo, useState } from "react";

export default function ProductCard({
  name,
  price,
  images = [],
  colors = [],
  image,
  instagramLink,
  sizes = [],
  inStock = true,
  rotateMs = 1200, // швидше для hover-прев’ю
}) {
  const slides = useMemo(() => {
    if (images.length > 0) return images;
    return image ? [image] : [];
  }, [images, image]);

  const [idx, setIdx] = useState(0);
  const [isHover, setIsHover] = useState(false);

  const hasMany = slides.length > 1;

  useEffect(() => {
    if (!hasMany || !isHover) return;
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % slides.length);
    }, rotateMs);
    return () => clearInterval(t);
  }, [hasMany, isHover, slides.length, rotateMs]);

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  return (
    <div
       className="
    bg-black/80 p-3 rounded-lg border border-white/10
    transform transition duration-200
    hover:scale-[1.02] hover:border-primary/60 hover:shadow-lg
  "
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Slider */}
<div className="relative overflow-hidden rounded-md">
  {/* Image */}
  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-md bg-black">
  <img
    src={slides[idx]}
    alt={name}
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
    />
    </div>



        {/* Arrows */}
        {hasMany && (
          <>
            <button
              onClick={prev}
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 border border-white/10 rounded-full w-9 h-9 flex items-center justify-center text-white/80 hover:text-primary hover:border-primary/60 transition-colors"
              aria-label="Попередній"
            >
              ‹
            </button>
            <button
              onClick={next}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 border border-white/10 rounded-full w-9 h-9 flex items-center justify-center text-white/80 hover:text-primary hover:border-primary/60 transition-colors"
              aria-label="Наступний"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {hasMany && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                type="button"
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === idx ? "bg-primary" : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

     <h3 className="text-lg font-semibold mt-3 mb-1">{name}</h3>
     <p className="text-sm mb-2 text-white/85">Ціна: {price}</p>


      {colors.length > 0 && (
        <p className="text-sm text-white/70 mb-3">
          Колір: <span className="text-white/85">{colors[idx] ?? "—"}</span>
        </p>
      )}

      {sizes.length > 0 ? (
        <div className="mb-4">
          <span
  className={`inline-block mb-2 px-3 py-1 rounded-full text-xs font-semibold
    ${inStock
      ? "bg-green-500/15 text-green-400 border border-green-500/30"
      : "bg-red-500/15 text-red-400 border border-red-500/30"}
  `}
>
  {inStock ? "В наявності" : "Немає в наявності"}
</span>

          <p className="text-sm text-white/70 mb-2">Розміри в наявності:</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-sm bg-secondary border border-white/10 text-white/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : (
       <span
  className={`inline-block mb-2 px-3 py-1 rounded-full text-xs font-semibold
    ${inStock
      ? "bg-green-500/15 text-green-400 border border-green-500/30"
      : "bg-red-500/15 text-red-400 border border-red-500/30"}
  `}
>
  {inStock ? "В наявності" : "Немає в наявності"}
</span>

      )}

      <a
        href={instagramLink}
        target="_blank"
        rel="noreferrer"
        className="block bg-primary text-black py-2.5 rounded-lg text-center text-sm font-semibold hover:bg-accent transition-colors hover:scale-[1.02] active:scale-[0.98]"
      >
        Замовити в Instagram
      </a>
    </div>
  );
}
