import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, X, KeyRound, ShieldCheck, CheckCircle2 } from "lucide-react";
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

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1 = email, 2 = OTP + password, 3 = success
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await api.post("/auth/forgot-password", { email: forgotEmail });
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || "Gagal mengirim kode verifikasi.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    try {
      await api.post("/auth/reset-password", {
        email: forgotEmail,
        code: otpCode,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      setForgotStep(3);
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || "Gagal mengubah kata sandi.");
    } finally {
      setForgotLoading(false);
    }
  };


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
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 
      
      const user = res.data.user;
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "penyeleksi") {
        navigate("/penyeleksi");
      } else {
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
    <div className="min-h-screen md:h-screen w-screen bg-white flex flex-col md:flex-row font-['Poppins'] overflow-x-hidden md:overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes borderSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-single-beam {
          animation: borderSpin 4s linear infinite !important;
        }
      `}} />
      

      <div className="w-full md:w-[48%] h-fit md:h-full p-3 md:p-4 shrink-0 flex flex-col z-10 relative">
        <div className="absolute inset-3 md:inset-4 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 w-[500%] h-[150%] bg-[conic-gradient(from_0deg,transparent_40%,#FEB700_48%,#FFFFFF_50%,#FEB700_52%,transparent_60%)] animate-single-beam" />
        </div>

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


      <div className="w-full md:w-[52%] h-auto md:h-screen p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
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
                  type="email" 
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
                <span 
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStep(1);
                    setForgotError("");
                    setOtpCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                    setShowForgotModal(true);
                  }}
                  className="text-[10px] sm:text-[11px] font-semibold text-gray-400 hover:text-[#0D278D] cursor-pointer transition-colors"
                >
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

      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!forgotLoading) setShowForgotModal(false);
              }}
              className="absolute inset-0 bg-[#08185A]/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-gray-100 p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                disabled={forgotLoading}
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              {forgotStep === 1 && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-[#0D278D] rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <KeyRound size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0D278D]">Lupa Kata Sandi?</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Masukkan alamat email terdaftar Anda. Kami akan mengirimkan 6-digit kode verifikasi untuk mereset kata sandi Anda.
                    </p>
                  </div>

                  {forgotError && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl">
                      <p className="text-red-600 text-[11px] font-bold leading-relaxed">{forgotError}</p>
                    </div>
                  )}

                  {forgotSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl">
                      <p className="text-emerald-600 text-[11px] font-bold leading-relaxed">{forgotSuccess}</p>
                    </div>
                  )}

                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="group/input">
                      <label className="text-[10px] sm:text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                          <Mail size={16} strokeWidth={2.2} />
                        </span>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs sm:text-sm font-medium rounded-xl pl-12 pr-4 py-3 sm:py-3.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D]"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-[#0D278D] text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-opacity-95 transition-all disabled:opacity-50"
                    >
                      {forgotLoading ? "Mengirim Kode..." : "Kirim Kode Verifikasi"}
                    </button>
                  </form>
                </div>
              )}

              {forgotStep === 2 && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-50 text-[#FEB700] rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0D278D]">Verifikasi & Reset</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Kode verifikasi 6-digit telah dikirim ke <span className="text-[#0D278D] font-semibold">{forgotEmail}</span>. Silakan masukkan kode dan kata sandi baru Anda.
                    </p>
                  </div>

                  {forgotError && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl">
                      <p className="text-red-600 text-[11px] font-bold leading-relaxed">{forgotError}</p>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="group/input">
                      <label className="text-[10px] sm:text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                        Kode Verifikasi (6 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-center tracking-[0.3em] font-extrabold text-sm sm:text-base rounded-xl py-3 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D]"
                        required
                        autoComplete="one-time-code"
                        name="verification_code"
                      />
                    </div>

                    <div className="group/input">
                      <label className="text-[10px] sm:text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                          <Lock size={16} strokeWidth={2.2} />
                        </span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs sm:text-sm font-medium rounded-xl pl-12 pr-12 py-3 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D]"
                          required
                          autoComplete="new-password"
                          name="new_password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#0D278D] transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="group/input">
                      <label className="text-[10px] sm:text-[11px] font-bold text-[#0D278D] block mb-1 tracking-wide pl-1">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within/input:text-[#0D278D] transition-colors">
                          <Lock size={16} strokeWidth={2.2} />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-gray-50/50 border-2 border-gray-100/80 text-xs sm:text-sm font-medium rounded-xl pl-12 pr-12 py-3 outline-none transition-all duration-300 focus:bg-white focus:border-[#0D278D]"
                          required
                          autoComplete="new-password"
                          name="new_password_confirmation"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#0D278D] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-[#0D278D] text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-opacity-95 transition-all disabled:opacity-50"
                    >
                      {forgotLoading ? "Memproses..." : "Reset Kata Sandi"}
                    </button>
                    
                    <button
                      type="button"
                      disabled={forgotLoading}
                      onClick={() => setForgotStep(1)}
                      className="w-full text-center text-xs text-gray-400 hover:text-[#0D278D] font-bold transition-colors block py-1 cursor-pointer disabled:opacity-50"
                    >
                      Kembali ke pengisian email
                    </button>
                  </form>
                </div>
              )}

              {forgotStep === 3 && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0D278D]">Reset Berhasil!</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Kata sandi Anda telah berhasil diubah. Silakan masuk kembali menggunakan kata sandi baru Anda.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setEmail(forgotEmail);
                    }}
                    className="w-full bg-[#0D278D] text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 mt-6 cursor-pointer hover:bg-opacity-95 transition-all"
                  >
                    Tutup & Login
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
