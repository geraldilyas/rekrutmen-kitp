import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/navbar'; 
import Footer from './components/footer';

import Home from './pages/beranda';
import Lowongan from './pages/lowongan';
import Status from './pages/status';
import Pengumuman from './pages/pengumuman';
import Arsip from './pages/arsip';

// dari be-gerald
import Login from './pages/login';
import Register from './pages/register';

import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/beranda" />} />

        <Route path="/beranda" element={<Home />} />
        <Route path="/lowongan" element={<Lowongan />} />
        <Route path="/status" element={<Status />} />
        <Route path="/pengumuman" element={<Pengumuman />} />
        <Route path="/arsip" element={<Arsip />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;