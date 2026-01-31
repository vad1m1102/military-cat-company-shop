import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "./ProductCard";

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      where("isActive", "==", true)
    );
   


    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [category]);

  if (!products.length) {
    return <p className="text-white/50">Товарів поки немає</p>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
  

}
