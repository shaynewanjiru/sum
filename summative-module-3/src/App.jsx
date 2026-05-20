import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import AdminForm from "./AdminPage/AdminForm";
import ProductEditPage from "./AdminPage/ProductEditPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./pages/NavBar";
import "./App.css";

function App() {
    return (
      <div className="App">
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/admin" element={<AdminForm />} />
        <Route path="/admin/edit/:id" element={<ProductEditPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;