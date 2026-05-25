import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Fingerprint, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api";

// Impor Aset Logo
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

export default function Register() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    nik: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg([]);
    setIsLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (error: any) {
      console.log("FULL ERROR:", error.response);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const list: string[] = [];

        Object.keys(errors).forEach((key) => {
          list.push(errors[key][0]);
        });

        setErrorMsg(list);
      } else if (error.response?.data?.message) {
        setErrorMsg([error.response.data.message]);
      } else {
        setErrorMsg(["Terjadi kesalahan server. Coba lagi nanti."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col md:flex-row font-['Poppins'] overflow-hidden">
      
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
      <div className="w-full md:w-[48%] h-1/3 md:h-full p-3 md:p-4 shrink-0 flex flex-col relative">
        
        {/* 🚀 SINGLE LAYER BEAM */}
        <div className="absolute inset-3 md:inset-4 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 w-[500%] h-[150%] bg-[conic-gradient(from_0deg,transparent_40%,#FEB700_48%,#FFFFFF_50%,#FEB700_52%,transparent_60%)] animate-single-beam" />
        </div>

        {/* 🚀 INNER CONTAINER */}
        <div className="w-full h-full bg-[#0D278D] p-6 md:p-12 relative flex flex-col justify-between overflow-hidden text-white rounded-[2rem] md:rounded-[2.5rem] z-10 m-[2px] shadow-[0_20px_50px_-15px_rgba(13,39,141,0.25)]">
          
          {/* Decorative Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#08185A] via-[#0D278D] to-blue-600 z-0" />
          <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

          {/* Top Section: Navigation Only */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={() => navigate("/beranda?status=logout")}
              className="inline-flex items-center gap-1.5 text-white hover:text-[#FEB700] text-xs font-bold uppercase tracking-wider mb-4 md:mb-12 transition-colors duration-300 group cursor-pointer"
            >
              <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
              Kembali ke Beranda
            </button>
          </div>

          {/* Bottom Headline Section */}
          <div className="relative z-10">
            <h1 className="text-2xl lg:text-[2.3rem] font-black mt-2 leading-tight tracking-tight">
              Selamat Datang <br />
              <span className="text-white">
                Bangun Karir Bersama BBWSMS{" "}
              </span>
            </h1>
            <p className="text-white/80 text-[11px] md:text-xs mt-1 md:mt-2 leading-relaxed max-w-sm font-light">
              Sistem seleksi berkas, administrasi, dan kompetensi terintegrasi Balai Besar Wilayah Sungai Mesuji Sekampung.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. RIGHT PANEL: FULL SCREEN FORMS (STRICT NO-SCROLL) ================= */}
      {/* 🛠️ DIUBAH: Menggunakan h-full md:h-screen & overflow-hidden serta padding ketat agar form tidak merosot kebawah */}
      <div className="w-full md:w-[52%] h-2/3 md:h-screen p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
        
        {/* Soft Decorative Blur behind form */}
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gray-50 rounded-full blur-3xl pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto relative z-10"
        >
          {/* Logo Header Rata Tengah */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoBbwsms} alt="Logo BBWS Utama" className="h-9 w-auto object-contain" />
              <div className="h-6 w-[1.5px] bg-[#0D278D]/20 self-center" />
              <img src={logoRekrutmen} alt="Logo Rekrutmen" className="h-7 w-auto object-contain" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#0D278D] tracking-tight">
              Selamat Datang!
            </h2>
            <p className="text-[11px] md:text-xs text-gray-400 mt-1 font-medium mb-5">
              Buat akun pelamar Anda untuk memulai registrasi berkas
            </p>
          </div>

          {/* Multi-Error Message Validation Box */}
          {errorMsg.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl max-h-24 overflow-y-auto"
            >
              <p className="text-red-700 font-bold text-[11px] mb-0.5">
                Registrasi gagal:
              </p>
              <ul className="list-disc list-inside">
                {errorMsg.map((msg, i) => (
                  <li key={i} className="text-red-600 text-[11px] font-medium">
                    {msg}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Form Content */}
          {/* 🛠️ DIUBAH: space-y diturunkan dari 7 menjadi 3.5 agar field merapat pas ke layar monitor */}
          <form onSubmit={handleRegister} className="space-y-3.5">
            
            {/* Field Nama Lengkap */}
            <div className="group/input">
              <label className="text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                  <User size={16} strokeWidth={2.2} />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Lengkap Anda"
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs md:text-sm font-medium rounded-xl pl-12 pr-4 py-2.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D] focus:border-1 focus:shadow-[0_4px_20px_rgba(13,39,141,0.02)]"
                  required
                />
              </div>
            </div>

            {/* Field NIK */}
            <div className="group/input">
              <label className="text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                Nomor Induk Kependudukan (NIK)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                  <Fingerprint size={16} strokeWidth={2.2} />
                </span>
                <input
                  type="text"
                  name="nik"
                  placeholder="16 Digit NIK Sesuai KTP"
                  maxLength={16}
                  value={form.nik}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs md:text-sm font-medium rounded-xl pl-12 pr-4 py-2.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D] focus:border-1 focus:shadow-[0_4px_20px_rgba(13,39,141,0.02)]"
                  required
                />
              </div>
            </div>

            {/* Field Email */}
            <div className="group/input">
              <label className="text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                  <Mail size={16} strokeWidth={2.2} />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs md:text-sm font-medium rounded-xl pl-12 pr-4 py-2.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D] focus:border-1 focus:shadow-[0_4px_20px_rgba(13,39,141,0.02)]"
                  required
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="group/input">
              <label className="text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                  <Lock size={16} strokeWidth={2.2} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs md:text-sm font-medium rounded-xl pl-12 pr-12 py-2.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D] focus:border-1 focus:shadow-[0_4px_20px_rgba(13,39,141,0.02)]"
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
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="group/btn w-full bg-white text-[#0D278D] py-3 rounded-xl border border-[#0D278D] font-bold text-xs md:text-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                <span>{isLoading ? "Memproses Registrasi..." : "Daftar Akun"}</span>
                {!isLoading && (
                  <LogIn size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                )}
              </button>
            </div>

            {/* Form Footer */}
            <p className="text-xs text-center text-gray-400 font-medium -mt-1.5">
              Sudah punya akun?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#0D278D] font-bold cursor-pointer hover:text-[#FEB700] transition-colors border-b border-transparent hover:border-[#FEB700] pb-0.5"
              >
                Masuk
              </span>
            </p>

          </form>
        </motion.div>
      </div>

    </div>
  );
}