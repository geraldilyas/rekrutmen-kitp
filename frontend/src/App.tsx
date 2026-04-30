import React from 'react';
import Navbar from './components/navbar'; // Pastikan path sesuai dengan letak file kamu
import Home from './pages/beranda';      // Sesuai dengan struktur folder di gambar kamu
import Footer from './components/footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Menampilkan Navbar di paling atas */}
      <Navbar />

      {/* 2. Menampilkan Konten Utama (Beranda) */}
      <main>
        <Home />
      </main>

      {/* 3. Menampilkan Footer di paling bawah */}
      <Footer />
    </div>
  )
}

export default App