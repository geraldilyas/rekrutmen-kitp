import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api";

// Impor Aset Logo
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 AMAN: Pembersihan sesi lama dipindah ke useEffect saat halaman login pertama kali dimuat murni
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      
      // 🚀 AMAN: Simpan token dan data user baru dari respons API
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 
      
      const user = res.data.user;
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "penyeleksi") {
        navigate("/penyeleksi");
      } else {
        // 🚀 AMAN: Berikan delay mikro agar localStorage berhasil dikunci oleh sistem internal browser sebelum dialihkan
        setTimeout(() => {
          window.location.replace("/beranda");
        }, 100);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Email atau password salah.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* 🚀 RESPONSIVE FIX: Mengubah h-screen kaku menjadi min-h-screen flex-col agar di HP konten numpuk vertikal dan bisa di-scroll aman */
    <div className="min-h-screen md:h-screen w-screen bg-white flex flex-col md:flex-row font-['Poppins'] overflow-x-hidden md:overflow-hidden">
      
      {/* 🚀 TRICK SECURE: Keyframes rotasi linear tanpa filter blur agar garis tetap solid dan tajam */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes borderSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-single-beam {
          animation: borderSpin 4s linear infinite !important;
        }
      `}} />
      
      {/* ================= 1. LEFT PANEL: FLOATING ROUNDED CARD BANNER WITH SINGLE SHARP BEAM ================= */}
      {/* 🚀 RESPONSIVE FIX: Tinggi panel kiri di mobile disesuaikan (h-fit) dengan padding ideal agar teks info tidak sesak */}
      <div className="w-full md:w-[48%] h-fit md:h-full p-3 md:p-4 shrink-0 flex flex-col z-10 relative">
        
        {/* 🚀 SINGLE LAYER BEAM */}
        <div className="absolute inset-3 md:inset-4 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 w-[500%] h-[150%] bg-[conic-gradient(from_0deg,transparent_40%,#FEB700_48%,#FFFFFF_50%,#FEB700_52%,transparent_60%)] animate-single-beam" />
        </div>

        {/* 🚀 INNER CONTAINER */}
        <div className="w-full h-full bg-[#0D278D] p-6 sm:p-8 md:p-12 relative flex flex-col justify-between overflow-hidden text-white rounded-[2rem] md:rounded-[2.5rem] z-10 m-[3px]">
          
          {/* Decorative Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#08185A] via-[#0D278D] to-blue-600 z-0" />
          <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

          {/* Top Section: Navigation Only */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={() => navigate("/beranda?status=logout")}
              className="inline-flex items-center gap-1.5 text-white hover:text-[#FEB700] text-xs font-bold uppercase tracking-wider mb-8 md:mb-12 transition-colors duration-300 group cursor-pointer"
            >
              <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
              Kembali ke Beranda
            </button>
          </div>

          {/* Bottom Headline Section */}
          <div className="relative z-10 mt-4 md:mt-0">
            <h1 className="text-xl sm:text-2xl lg:text-[2.3rem] font-black leading-tight tracking-tight">
              Selamat Datang <br />
              <span className="text-white">
                Bangun Karir Bersama BBWSMS{" "}
              </span>
            </h1>
            <p className="text-white/80 text-[10px] sm:text-xs mt-1.5 md:mt-2 leading-relaxed max-w-sm font-light">
              Sistem seleksi berkas, administrasi, dan kompetensi terintegrasi Balai Besar Wilayah Sungai Mesuji Sekampung.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. RIGHT PANEL: FULL SCREEN FORMS (STRICT NO-SCROLL ON DESKTOP) ================= */}
      {/* 🚀 RESPONSIVE FIX: h-auto di mobile dengan padding responsif agar pas form memanjang ke bawah tidak terpotong screen */}
      <div className="w-full md:w-[52%] h-auto md:h-screen p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
        
        {/* Soft Decorative Blur behind form */}
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gray-50 rounded-full blur-3xl pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto relative z-10 my-auto md:my-0"
        >
          {/* Logo Header Rata Tengah */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoBbwsms} alt="Logo BBWS Utama" className="h-8 sm:h-9 w-auto object-contain" />
              <div className="h-6 w-[1.5px] bg-[#0D278D]/20 self-center" />
              <img src={logoRekrutmen} alt="Logo Rekrutmen" className="h-6 sm:h-7 w-auto object-contain" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0D278D] tracking-tight">
              Selamat Datang Kembali!
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium mb-5">
              Lanjutkan perjalanan rekrutmen Anda bersama BBWSMS
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl"
            >
              <p className="text-red-600 text-[10px] sm:text-[11px] font-bold leading-relaxed">{errorMsg}</p>
            </motion.div>
          )}

          {/* Form Content */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Field Email */}
            <div className="group/input">
              <label className="text-[10px] sm:text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                  <Mail size={16} strokeWidth={2.2} />
                </span>
                <input
                  type="email" // 🚀 FIXED: Dikembalikan murni ke email tipe bawaan asli lo bro!
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs md:text-sm font-medium rounded-xl pl-12 pr-4 py-3.5 sm:py-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D] focus:shadow-[0_4px_20px_rgba(13,39,141,0.02)]"
                  required
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="group/input">
              <div className="flex justify-between items-center mb-1 pl-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-[#0D278D] tracking-wide">
                  Kata Sandi
                </label>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 hover:text-[#0D278D] cursor-pointer transition-colors">
                  Lupa Sandi?
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                  <Lock size={16} strokeWidth={2.2} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs md:text-sm font-medium rounded-xl pl-12 pr-12 py-3.5 sm:py-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D] focus:shadow-[0_4px_20px_rgba(13,39,141,0.02)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#0D278D] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group/btn w-full bg-white text-[#0D278D] py-3.5 sm:py-4 rounded-xl border border-[#0D278D] font-bold text-xs md:text-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                <span>{isLoading ? "Menghubungkan..." : "Masuk"}</span>
                {!isLoading && (
                  <LogIn size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                )}
              </button>
            </div>

            {/* Form Footer */}
            <p className="text-[11px] sm:text-xs text-center text-gray-400 font-medium ">
              Belum punya akun?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-[#0D278D] font-bold cursor-pointer hover:text-[#FEB700] transition-colors border-b border-transparent hover:border-[#FEB700] pb-0.5"
              >
                Daftar
              </span>
            </p>

          </form>
        </motion.div>
      </div>

    </div>
  );
}