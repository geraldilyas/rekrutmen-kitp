import React, { useState, useEffect, useRef } from "react";
import { motion, } from "framer-motion";
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  CreditCard, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Lock, 
  Camera, 
  Loader2, 
  Calendar,
  Sparkles,
  KeyRound
} from "lucide-react";
import { useProfile, useUserDocuments } from "../shared/profileHooks";
import { api } from "../../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, } }
};

const UserProfile: React.FC = () => {
  const { user, loading: profileLoading, updateProfile, changePassword } = useProfile();
  const { documents, loading: docsLoading, uploadDocument, deleteDocument } = useUserDocuments();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setFormDataPassword] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [pwdStatus, setPwdStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      await updateProfile(formData);
      setStatus({ type: 'success', message: 'Profil pribadi berhasil diperbarui' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Gagal memperbarui data profil' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPwdStatus({ type: 'error', message: 'Konfirmasi kata sandi baru tidak cocok' });
      return;
    }
    setIsChangingPwd(true);
    setPwdStatus(null);
    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      });
      setPwdStatus({ type: 'success', message: 'Autentikasi kredensial sandi berhasil diubah' });
      setFormDataPassword({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err: any) {
      setPwdStatus({ type: 'error', message: err.message || 'Gagal mengubah proteksi kata sandi' });
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleFileUpload = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    try {
      await uploadDocument(type, file);
      setStatus({ type: 'success', message: `Berkas ${type.toUpperCase()} berhasil disinkronisasi` });
    } catch (err: any) {
      setStatus({ type: 'error', message: `Gagal mengunggah dokumen ${type.toUpperCase()}` });
    } finally {
      setUploadingType(null);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran batas maksimal pasfoto adalah 2MB bro.");
      return;
    }

    try {
      setUploadingAvatar(true);
      const formDataToSend = new FormData();
      formDataToSend.append("avatar", file);

      const res = await api.post("/user/avatar", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updatedAvatar = res.data.avatar_url;
      setAvatarUrl(updatedAvatar);
    } catch (err) {
      console.error("Gagal sinkronisasi avatar:", err);
      const localPreview = URL.createObjectURL(file);
      setAvatarUrl(localPreview);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (profileLoading && !user) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-[#0D278D]"></div>
      </div>
    );
  }

  const documentTypes = [
    { key: 'ktp', label: 'Kartu Tanda Penduduk (KTP)', icon: CreditCard },
    { key: 'cv', label: 'Curriculum Vitae / Riwayat Hidup', icon: FileText },
    { key: 'ijazah', label: 'Ijazah Kelulusan Terakhir', icon: FileText },
    { key: 'transkrip', label: 'Lembar Transkrip Nilai Resmi', icon: FileText },
  ];

  return (
    <div className="bg-white min-h-screen pt-36 pb-24 font-['Poppins'] text-gray-900 selection:bg-[#FEB700]/30 relative overflow-hidden">
      
      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

     <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start" 
      >
        {/* ============================================================================
            ⭐ COL LEFT (4-SPAN): CENTERED CONTENT CARD & TOP-ALIGNED STRUCTURE
            ============================================================================ */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-4 lg:sticky lg:top-1 flex flex-col justify-start" 
        >
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Minimalist Top Gradient Line */}
{/* 🚀 GERAK KANAN KE KIRI MURNI TAILWIND: Menggunakan animate-marquee bawaan biar konstan bolak-balik */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[4px]"
              style={{
                background: "linear-gradient(90deg, #0D278D, #FEB700, #0D278D)",
                backgroundSize: "400% 100%", // 🚀 Diperlebar jadi 400% biar jarak warna biru ke kuning renggang banget
              }}
              animate={{
                backgroundPosition: ["0% center", "400% center"] // 🚀 Digeser sejauh 400% seirama ukuran background
              }}
              transition={{
                duration: 20, // 🚀 Durasi 20 detik, dijamin jalannya bakal santai dan smooth parah
                ease: "linear",
                repeat: Infinity,
              }}
            />
            
            {/* Interactive Passphoto (Centered) */}
            <div className="relative cursor-pointer group/avatar mb-6 mt-4 shrink-0" onClick={handleAvatarClick}>
              <div className="w-24 h-24 rounded-full bg-slate-50 border border-gray-100 overflow-hidden flex items-center justify-center text-[#0D278D] text-2xl font-black relative transition-all duration-300 group-hover/avatar:ring-4 group-hover/avatar:ring-slate-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0D278D] text-white flex items-center justify-center border-2 border-white transition-transform duration-300 group-hover/avatar:scale-110">
                {uploadingAvatar ? <Loader2 size={10} className="animate-spin" /> : <Camera size={10} />}
              </div>
            </div>

            {/* Nama & Teks Identitas (Centered - No Truncate, membungkus aman ke bawah) */}
            <div className="space-y-1 w-full flex flex-col items-center">
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                <h2 className="text-2xl font-extrabold text-[#0D278D] tracking-tight leading-tight break-words max-w-full text-center">
                  {formData.name || "User Akun"}
                </h2>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-[-10]">Pelamar Swadaya</p>
            </div>
            
            <div className="w-full border-t border-gray-100 my-6" />
            
            {/* Meta Informasi Akun Kontak */}
            <div className="w-full space-y-4 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <span className="break-all text-gray-600 font-semibold">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-600">Registrasi: {user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "22 Mei 2026"}</span>
              </div>
              <div className="flex items-center gap-3 text-[#0D278D]">
                <Lock size={14} className="text-[#0D278D] opacity-70 shrink-0" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Status: Terotentikasi</span>
              </div>
            </div>
          </div>

          {/* Alert Label Vault System */}
          <div className="p-5 rounded-2xl bg-slate-50/60 border border-gray-100 flex gap-3.5 items-start mt-5">
            <Lock size={16} className="text-[#0D278D] mt-0.5 shrink-0 opacity-70" />
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Data terenkripsi otomatis di dalam cloud vault keamanan sistem informasi rekrutmen internal BBWSMS.
            </p>
          </div>
        </motion.div>

        {/* ============================================================================
            ⭐ COL RIGHT (8-SPAN): CLEAN EDITORIAL PORTAL LAYOUT
            ============================================================================ */}
        <div className="lg:col-span-8 space-y-14 pl-0 lg:pl-4">
          
          {/* BARIS DATA BIODATA */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="pb-4 border-b border-gray-900/10">
              <h3 className="text-medium font-bold text-[#0D278D]  uppercase flex items-center gap-2">
                <User size={14} className="text-[#0D278D]" /> Kualifikasi Data Personal
              </h3>
            </div>

            {status && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <p className="text-xs font-bold">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nomor Induk Kependudukan (NIK)</span>
                  <div className="relative flex items-center">
                    <CreditCard size={14} className="absolute left-0 text-gray-300 pointer-events-none" />
                    <input type="text" value={user?.nik || "Internal System Locked"} disabled className="w-full pl-6 py-3 bg-transparent border-b border-gray-100 text-xs font-bold text-gray-400 outline-none italic cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Alamat Email Korespondensi</span>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-0 text-[#0D278D] pointer-events-none" />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-6 py-3 bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 outline-none transition-all" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nama Lengkap Sesuai KTP</span>
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-0 text-[#0D278D] pointer-events-none" />
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-6 py-3 bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 outline-none transition-all" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nomor Kontak Seluler (WhatsApp)</span>
                  <div className="relative flex items-center">
                    <Phone size={14} className="absolute left-0 text-[#0D278D] pointer-events-none" />
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-6 py-3 bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Alamat Domisili Rumah Lengkap</span>
                <div className="relative flex items-center">
                  <MapPin size={14} className="absolute left-0 text-[#0D278D] pointer-events-none" />
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full pl-6 py-3 bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 outline-none transition-all" />
                </div>
              </div>

              {/* 🚀 FIX BUTTON: Gaya Minimalist Border Utama */}
              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-5 py-2.5 rounded-xl border border-[#0D278D] text-[#0D278D] text-xs font-bold uppercase tracking-wider hover:bg-[#0D278D] hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </motion.section>

          {/* BARIS DATA PENGUBAHAN PASSWORD */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="pb-4 border-b border-gray-900/10">
              <h3 className="text-xs font-bold text-[#0D278D] uppercase  flex items-center gap-2">
                <KeyRound size={14} className="text-[#0D278D]" /> Otentikasi Keamanan Kredensial
              </h3>
            </div>

            {pwdStatus && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${pwdStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {pwdStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <p className="text-xs font-bold">{pwdStatus.message}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kata Sandi Akun Saat Ini</span>
                <input type="password" value={passwordData.current_password} onChange={(e) => setFormDataPassword({ ...passwordData, current_password: e.target.value })} className="w-full bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 py-3 px-1 outline-none transition-all" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Input Kata Sandi Baru</span>
                  <input type="password" value={passwordData.new_password} onChange={(e) => setFormDataPassword({ ...passwordData, new_password: e.target.value })} className="w-full bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 py-3 px-1 outline-none transition-all" required />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ulangi Konfirmasi Sandi Baru</span>
                  <input type="password" value={passwordData.new_password_confirmation} onChange={(e) => setFormDataPassword({ ...passwordData, new_password_confirmation: e.target.value })} className="w-full bg-transparent border-b border-gray-200 focus:border-[#0D278D] text-xs font-bold text-gray-800 py-3 px-1 outline-none transition-all" required />
                </div>
              </div>

              {/* 🚀 FIX BUTTON: Gaya Minimalist Border Kredensial */}
              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isChangingPwd} 
                  className="px-5 py-2.5 rounded-xl border border-[#0D278D] text-[#0D278D] text-xs font-bold uppercase tracking-wider hover:bg-[#0D278D] hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isChangingPwd ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
                  <span>Perbarui Sandi</span>
                </button>
              </div>
            </form>
          </motion.section>

          {/* BARIS DOKUMEN MASTER ARCHITECTURE */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="pb-4 border-b border-gray-900/10">
              <h3 className="text-xs font-bold text-[#0D278D] uppercase flex items-center gap-2">
                <FileText size={14} className="text-[#0D278D]" /> Vault Master Berkas Digital
              </h3>
            </div>

            <div className="divide-y divide-gray-900/5">
              {documentTypes.map((type, idx) => {
                const existing = documents.find(d => d.type === type.key);
                const isUploading = uploadingType === type.key;

                return (
                  <div key={type.key} className="py-5 flex items-center justify-between gap-6 group transition-colors duration-200 hover:bg-slate-50/50 px-2 rounded-xl">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-xs text-[#0D278D] font-medium">0{idx + 1}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide group-hover:text-[#0D278D] transition-colors truncate">{type.label}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${existing ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider truncate max-w-[200px] ${existing ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {existing ? (existing.file_name || 'Cloud Connected') : 'Berkas Kosong'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 🚀 FIX BUTTONS: Penyeragaman Seluruh Button Berkas ke Border Style */}
                    <div className="flex items-center gap-3 shrink-0">
                      {existing ? (
                        <>
                          <a 
                            href={`/storage/${existing.file_path}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-4 py-1.5 rounded-lg border border-[#0D278D] text-[#0D278D] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0D278D] hover:text-white transition-all duration-300 flex items-center gap-1"
                          >
                            <Eye size={12} /> Buka
                          </a>
                          <button 
                            type="button"
                            onClick={() => deleteDocument(existing.id)}
                            className="px-2 py-1.5 rounded-lg border border-rose-200 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <label className="px-4 py-1.5 rounded-lg border border-[#0D278D] text-[#0D278D] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0D278D] hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-1">
                          {isUploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
                          <span>{isUploading ? 'Sync...' : 'Unggah'}</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(type.key, e)}
                            disabled={isUploading || docsLoading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

        </div>
      </motion.main>
    </div>
  );
};

// Guard Fallback Pivot
const FileCheck: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <FileText size={size} className={className} />
);

export default UserProfile;