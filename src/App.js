import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MilitaryCatAdmin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
