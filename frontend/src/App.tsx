import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'; 
import Home from './pages/beranda';      
import Footer from './components/footer';
import Lowongan from './pages/lowongan';
import Status from './pages/status';
import Pengumuman from './pages/pengumuman';
import Arsip from './pages/arsip';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* 1. Panggil Navbar di sini supaya muncul di atas semua halaman */}
        <Navbar />

        {/* 2. Ini area konten yang akan berubah-ubah sesuai URL */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lowongan" element={<Lowongan />} />
          <Route path="/status" element={<Status />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/arsip" element={<Arsip />} />
        </Routes>

        {/* 3. Panggil Footer di sini supaya muncul di paling bawah */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;