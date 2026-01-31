import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { uploadImage } from "../utils/UploadImage";

const CATEGORIES = ["Новинки","Шеврони","Футболки", "Худі", "Шапки", "Сувеніри", "Чохли","Шкарпетки"];

export default function Admin() {
  const [user, setUser] = useState(null);

  const [uploadPct, setUploadPct] = useState(0);

  // login
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  // products
  const [products, setProducts] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [msg, setMsg] = useState("");

  // form state
  const empty = useMemo(
    () => ({
      id: null,
      name: "",
      category: "Худі",
      price: "",
      instagramLink: "https://www.instagram.com/military_cat_company_/",
      colorsText: "", // "Рожевий, Чорний"
      sizesText: "",  // "S, M, L, XL"
      inStock: true,
      isActive: true,
      newFiles: [],
      images: [],
    }),
    []
  );
  const [form, setForm] = useState(empty);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [user]);

  const login = async (e) => {
    e.preventDefault();
    setLoginErr("");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setLoginErr(err?.message || "Login error");
    }
  };

  const logout = () => signOut(auth);

  const edit = (p) => {
    setMsg("");
    setForm({
      id: p.id,
      name: p.name ?? "",
      category: p.category ?? "Худі",
      price: p.price ?? "",
      instagramLink: p.instagramLink ?? "https://www.instagram.com/military_cat_company_/",
      colorsText: Array.isArray(p.colors) ? p.colors.join(", ") : "",
      sizesText: Array.isArray(p.sizes) ? p.sizes.join(", ") : "",
      inStock: p.inStock ?? true,
      isActive: p.isActive ?? true,
      newFiles: [],
      images: Array.isArray(p.images) ? p.images : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => setForm(empty);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");

     console.log("SAVE: start");

    if (!form.name.trim()) return setMsg("Вкажи назву товару");
    if (form.price === "" || Number.isNaN(Number(form.price))) return setMsg("Вкажи ціну числом");

    setUploadPct(0);

    setLoadingSave(true);
    try {

    console.log("SAVE: images before upload", form.images);
    console.log("SAVE: newFiles", form.newFiles);

      // upload new images if any
      let urls = [...(form.images || [])];

if (form.newFiles?.length) {

    console.log("SAVE: uploading files...");

  const uploaded = await Promise.all(
    form.newFiles.map((f, i) =>
      uploadImage(f, "products", (pct) => {
        // показує прогрес останнього файлу (або зробимо сумарний якщо треба)
        setUploadPct(pct);
      })
    )
  );


  urls = urls.concat(uploaded);
}

   


      const colors = form.colorsText
        ? form.colorsText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const sizes = form.sizesText
        ? form.sizesText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        instagramLink: form.instagramLink.trim(),
        images: urls,
        colors,
        sizes,
        inStock: !!form.inStock,   // ✅ наявність
        isActive: !!form.isActive,
        updatedAt: serverTimestamp(),
      };


      if (form.id) {
        await updateDoc(doc(db, "products", form.id), payload);
        setMsg("✅ Оновлено");
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setMsg("✅ Додано");
      }

      reset();
    } catch (err) {
        console.error("SAVE ERROR:", err);
      setMsg("❌ Помилка: " + (err?.message || "unknown"));
    } finally {
      
      setLoadingSave(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Видалити товар?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      setMsg("🗑 Видалено");
      if (form.id === id) reset();
    } catch (err) {
      setMsg("❌ Помилка: " + (err?.message || "unknown"));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary text-white flex items-center justify-center p-6">
        <form onSubmit={login} className="w-full max-w-sm bg-black/60 border border-white/10 rounded-lg p-4">
          <h1 className="text-xl font-semibold mb-4">Admin Login</h1>

          <input
            className="w-full mb-3 p-2 rounded bg-black/40 border border-white/10"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full mb-3 p-2 rounded bg-black/40 border border-white/10"
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          {loginErr && <p className="text-sm text-red-400 mb-3">{loginErr}</p>}

          <button className="w-full bg-primary text-black py-2 rounded font-semibold">
            Увійти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary text-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-semibold">Admin: товари</h1>
          <button onClick={logout} className="bg-black/60 border border-white/10 px-4 py-2 rounded hover:border-primary/60">
            Вийти
          </button>
        </div>

        {/* FORM */}
        <div className="bg-black/60 border border-white/10 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">
            {form.id ? "Редагувати товар" : "Додати товар"}
          </h2>

          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="p-2 rounded bg-black/40 border border-white/10"
              placeholder="Назва"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            <select
              className="p-2 rounded bg-black/40 border border-white/10"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <input
              className="p-2 rounded bg-black/40 border border-white/10"
              placeholder="Ціна (число)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />

            <input
              className="p-2 rounded bg-black/40 border border-white/10"
              placeholder="Instagram link"
              value={form.instagramLink}
              onChange={(e) => setForm((f) => ({ ...f, instagramLink: e.target.value }))}
            />

            <input
              className="p-2 rounded bg-black/40 border border-white/10"
              placeholder="Кольори (через кому)"
              value={form.colorsText}
              onChange={(e) => setForm((f) => ({ ...f, colorsText: e.target.value }))}
            />

            <input
              className="p-2 rounded bg-black/40 border border-white/10"
              placeholder="Розміри (через кому)"
              value={form.sizesText}
              onChange={(e) => setForm((f) => ({ ...f, sizesText: e.target.value }))}
            />

            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
              />
              В наявності
            </label>

            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Показувати на сайті
            </label>

            <div className="md:col-span-2">
              <input
                className="w-full p-2 rounded bg-black/40 border border-white/10"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setForm((f) => ({ ...f, newFiles: Array.from(e.target.files || []) }))}
              />
              <p className="text-xs text-white/50 mt-1">
                Можна додати кілька фото. Під час редагування нові фото додадуться до існуючих.
              </p>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                disabled={loadingSave}
                className="bg-primary text-black px-4 py-2 rounded font-semibold disabled:opacity-60"
              >
                {loadingSave ? "Збереження..." : "Зберегти"}
              </button>
              {loadingSave && (
  <p className="text-xs text-white/60">
    Завантаження фото: {uploadPct}%
  </p>
)}
              <button type="button" onClick={reset} className="bg-black/60 border border-white/10 px-4 py-2 rounded">
                Очистити
              </button>
            </div>

            {msg && <p className="md:col-span-2 text-sm text-white/80">{msg}</p>}
          </form>
        </div>

        {/* LIST */}
        <div className="bg-black/60 border border-white/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-3 text-xs text-white/60 border-b border-white/10">
            <div className="col-span-5">Товар</div>
            <div className="col-span-2">Категорія</div>
            <div className="col-span-2">Ціна</div>
            <div className="col-span-1">Наявн.</div>
            <div className="col-span-2 text-right">Дії</div>
          </div>

          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-2 p-3 items-center border-b border-white/5">
              <div className="col-span-5">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-white/50">{p.isActive ? "On" : "Off"}</div>
              </div>
              <div className="col-span-2 text-sm text-white/80">{p.category}</div>
              <div className="col-span-2 text-sm text-white/80">{p.price} грн</div>
              <div className="col-span-1 text-sm">{p.inStock ? "✅" : "—"}</div>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => edit(p)} className="text-primary hover:underline text-sm">
                  Edit
                </button>
                <button onClick={() => remove(p.id)} className="text-red-400 hover:underline text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!products.length && <div className="p-4 text-white/50">Поки немає товарів.</div>}
        </div>
      </div>
    </div>
  );
}
