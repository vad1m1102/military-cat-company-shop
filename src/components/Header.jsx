export default function Header() {
  const scrollToShop = () => {
    const el = document.getElementById("shop");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <header className="px-6 pt-10 pb-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Logo / avatar */}
          <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-primary shadow-lg">
            <img
              src="/images/logo.jpg"
              alt="Military Cat Company"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + tagline */}
          <div>
            <h1 className="font-gothic text-5xl md:text-6xl text-primary">
            Military Cat Company
            </h1>


            {/* small badges */}
           {/* Typography info */}
<div className="mt-4 text-center">
  {/* Categories */}
  <p className="font-semibold text-base md:text-lg tracking-wide text-white/85">
    Подарункові бокси
    <span className="mx-2 text-primary">•</span>
    Тактичний одяг
    <span className="mx-2 text-primary">•</span>
    Сувеніри
  </p>

  {/* Meta info */}
  <p className="font-semibold mt-2 text-sm tracking-wide text-white/60">
    Відправка по Україні / За кордон
    <span className="mx-2">•</span>
    Гурт / Роздріб
    <span className="mx-2">•</span>
    Під замовлення
  </p>
</div>


            {/* CTA */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={scrollToShop}
                className="bg-primary text-black font-semibold py-3 px-6 rounded-lg hover:bg-accent transition-colors"
              >
                Дивитись товари
              </button>

              <a
                href="https://www.instagram.com/military_cat_company_/"
                target="_blank"
                rel="noreferrer"
                className="bg-black/70 border border-primary/60 text-white font-semibold py-3 px-6 rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                Замовити в Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-white/10" />
      </div>
    </header>
  );
}
