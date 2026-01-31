import ProductList from "../components/ProductList";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryNav from "../components/CategoryNav";



const CATEGORIES = [
  { id: "new", label: "Новинки"},
  { id: "hoodies", label: "Худі" },
  { id: "tshirts", label: "Футболки" },
  { id: "patches", label: "Шеврони" },
  { id: "hats", label: "Шапки" },
  { id: "socks", label: "Шкарпетки" },
  { id: "cases", label: "Чохли" },
  { id: "souvenirs", label: "Сувеніри" },
];

export default function Home() {
  return (
    <div className="bg-secondary text-white">
      <Header />

     <div id="shop" />
    <CategoryNav items={CATEGORIES} />

      {/* Категорії */}
      <section className="py-10 px-6">
        <div className="mx-auto max-w-6xl space-y-14">
          {CATEGORIES.map((c) => (
            <div key={c.id} id={c.id}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {c.label}
              </h2>
              <ProductList category={c.label} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
