import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Beranda from "./pages/beranda";
import Login from "./pages/login";
import Register from "./pages/register";
import Lowongan from "./pages/lowongan";
import Status from "./pages/status";
import Pengumuman from "./pages/pengumuman";
import Arsip from "./pages/arsip";

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Routing */}
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/beranda" />} />

        {/* Public */}
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Menu utama */}
        <Route path="/lowongan" element={<Lowongan />} />
        <Route path="/status" element={<Status />} />
        <Route path="/pengumuman" element={<Pengumuman />} />
        <Route path="/arsip" element={<Arsip />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;