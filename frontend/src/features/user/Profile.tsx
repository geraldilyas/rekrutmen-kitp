import React, { useState, useEffect, useRef } from "react";
import { motion,  } from "framer-motion";
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
  Trash2, 
  Eye, 
  Lock, 
  Camera, 
  Loader2, 
  Calendar,
  KeyRound,
  Link as LinkIcon
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
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};


const scrollSectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const UserProfile: React.FC = () => {
  const { user, loading: profileLoading, updateProfile, changePassword } = useProfile();
  const { documents, saveDocumentLink, deleteDocument } = useUserDocuments();
  
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

  const [docLinks, setDocLinks] = useState<{ [key: string]: string }>({
    ktp: "",
    cv: "",
    ijazah: "",
    transkrip: ""
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [pwdStatus, setPwdStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [docStatus, setDocStatus] = useState<{ type: 'success' | 'error', message: string, key?: string } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [isSavingDoc, setIsSavingDoc] = useState<string | null>(null);
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

      if (user.avatar_path) {
        if (user.avatar_path.startsWith('http')) {
          setAvatarUrl(user.avatar_path);
        } else {
          setAvatarUrl(`http://127.0.0.1:8000/storage/${user.avatar_path}`);
        }
      } else {
        setAvatarUrl("");
      }
    }
  }, [user]);

  useEffect(() => {
    if (documents.length > 0) {
      const newLinks = { ...docLinks };
      documents.forEach(doc => {
        if (newLinks.hasOwnProperty(doc.type)) {
          newLinks[doc.type] = doc.file_path;
        }
      });
      setDocLinks(newLinks);
    }
  }, [documents]);

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
      setPwdStatus({ type: 'error', message: err.message || 'Gagal mengubah kata sandi' });
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleSaveDocLink = async (type: string) => {
    const url = docLinks[type];
    if (!url || !url.startsWith('http')) {
      setDocStatus({ type: 'error', message: 'Harap masukkan tautan yang valid (http/https)', key: type });
      return;
    }

    setIsSavingDoc(type);
    setDocStatus(null);
    try {
      await saveDocumentLink(type, url);
      setDocStatus({ type: 'success', message: `Tautan ${type.toUpperCase()} disimpan`, key: type });
    } catch (err: any) {
      setDocStatus({ type: 'error', message: 'Gagal menyimpan tautan', key: type });
    } finally {
      setIsSavingDoc(null);
    }
  };

  const handleRemoveDoc = async (type: string, id: number) => {
    if (!window.confirm(`Hapus tautan ${type.toUpperCase()}?`)) return;
    try {
      await deleteDocument(id);
      setDocLinks({ ...docLinks, [type]: "" });
      setDocStatus({ type: 'success', message: `Tautan ${type.toUpperCase()} dihapus`, key: type });
    } catch (err) {
      setDocStatus({ type: 'error', message: 'Gagal menghapus tautan', key: type });
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

      if (res.data && res.data.avatar_url) {
        setAvatarUrl(res.data.avatar_url);
        if (user) {
          user.avatar_path = res.data.avatar_url; 
        }
        alert("Pasfoto profil berhasil disinkronkan ke server, bro!");
      }
    } catch (err) {
      console.error("Gagal sinkronisasi avatar:", err);
      const localPreview = URL.createObjectURL(file);
      setAvatarUrl(localPreview);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

 if (profileLoading && !user) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center select-none">
        <div 
          className="w-28 h-8 flex items-center justify-center overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
          }}
        >
          <svg 
            className="absolute w-[200%] h-full left-0" 
            viewBox="0 0 200 40" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="profileRiverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#0D278D" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            <motion.path
              d="M 0 20 Q 12.5 8, 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
              fill="none"
              stroke="url(#profileRiverGradient)"
              strokeWidth="7" 
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ x: 0 }}
              animate={{ x: -100 }} 
              transition={{
                duration: 4.5, // Lambat, tenang, dan rileks seperti sungai asli
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </svg>
        </div>
        
      </div>
    );
  }if (profileLoading && !user) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center select-none">
        <div 
          className="w-28 h-8 flex items-center justify-center overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
          }}
        >
          <svg 
            className="absolute w-[200%] h-full left-0" 
            viewBox="0 0 200 40" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="profileRiverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#0D278D" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            <motion.path
              d="M 0 20 Q 12.5 8, 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
              fill="none"
              stroke="url(#profileRiverGradient)"
              strokeWidth="7" 
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ x: 0 }}
              animate={{ x: -100 }} 
              transition={{
                duration: 4.5, 
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </svg>
        </div>
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
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-4 lg:sticky lg:top-1 flex flex-col justify-start" 
        >
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 flex flex-col items-center text-center relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            
            <motion.div 
              className="absolute top-0 left-0 w-full h-[4px]"
              style={{
                background: "linear-gradient(90deg, #0D278D, #FEB700, #0D278D)",
                backgroundSize: "400% 100%",
              }}
              animate={{
                backgroundPosition: ["0% center", "400% center"]
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            
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

            <div className="space-y-1 w-full flex flex-col items-center">
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                <h2 className="text-2xl font-extrabold text-[#0D278D] tracking-tight leading-tight break-words max-w-full text-center">
                  {formData.name || "User Akun"}
                </h2>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-[-10]">Pelamar Swadaya</p>
            </div>
            
            <div className="w-full border-t border-gray-100 my-6" />
            
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

          <div className="p-5 rounded-2xl bg-slate-50/60 border border-gray-100 flex gap-3.5 items-start mt-5">
            <Lock size={16} className="text-[#0D278D] mt-0.5 shrink-0 opacity-70" />
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Data terenkripsi otomatis di dalam cloud vault keamanan sistem informasi rekrutmen internal BBWSMS.
            </p>
          </div>
        </motion.div>

        <div className="lg:col-span-8 space-y-14 pl-0 lg:pl-4">
          <motion.section 
            variants={scrollSectionVariants} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div className="pb-4 border-b border-gray-900/10">
              <h3 className="text-medium font-bold text-[#0D278D] uppercase flex items-center gap-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                
                {/* Kolom NIK */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nomor Induk Kependudukan (NIK)</span>
                  <div className="relative flex items-center">
                    <CreditCard size={14} className="absolute left-4 text-gray-300 pointer-events-none z-10" />
                    <input 
                      type="text" 
                      value={user?.nik || "Internal System Locked"} 
                      disabled 
                      className="w-full pl-11 pr-4 h-[46px] bg-gray-50 border border-gray-200/60 rounded-xl text-xs font-bold text-gray-400 outline-none italic cursor-not-allowed" 
                    />
                  </div>
                </div>

                {/* Kolom Email */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Alamat Email Korespondensi</span>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-4 text-[#0D278D] pointer-events-none z-10" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      className="w-full pl-11 pr-4 h-[46px] bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                      required 
                    />
                  </div>
                </div>

                {/* Kolom Nama */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nama Lengkap Sesuai KTP</span>
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-4 text-[#0D278D] pointer-events-none z-10" />
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full pl-11 pr-4 h-[46px] bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                      required 
                    />
                  </div>
                </div>

                {/* Kolom No Kontak */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nomor Kontak Seluler (WhatsApp)</span>
                  <div className="relative flex items-center">
                    <Phone size={14} className="absolute left-4 text-[#0D278D] pointer-events-none z-10" />
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      className="w-full pl-11 pr-4 h-[46px] bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Domisili */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Alamat Domisili Rumah Lengkap</span>
                <div className="relative flex items-center">
                  <MapPin size={14} className="absolute left-4 text-[#0D278D] pointer-events-none z-10" />
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    className="w-full pl-11 pr-4 h-[46px] bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
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

          <motion.section 
            variants={scrollSectionVariants} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div className="pb-4 border-b border-gray-900/10">
              <h3 className="text-xs font-bold text-[#0D278D] uppercase flex items-center gap-2">
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
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kata Sandi Akun Saat Ini</span>
                <input 
                  type="password" 
                  value={passwordData.current_password} 
                  onChange={(e) => setFormDataPassword({ ...passwordData, current_password: e.target.value })} 
                  className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Input Kata Sandi Baru</span>
                  <input 
                    type="password" 
                    value={passwordData.new_password} 
                    onChange={(e) => setFormDataPassword({ ...passwordData, new_password: e.target.value })} 
                    className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ulangi Konfirmasi Sandi Baru</span>
                  <input 
                    type="password" 
                    value={passwordData.new_password_confirmation} 
                    onChange={(e) => setFormDataPassword({ ...passwordData, new_password_confirmation: e.target.value })} 
                    className="w-full h-[46px] px-4 bg-white border border-gray-200 rounded-xl focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-bold text-gray-800 outline-none transition-all duration-200" 
                    required 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
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

          <motion.section 
            variants={scrollSectionVariants} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <div className="pb-4 border-b border-gray-900/10">
              <h3 className="text-xs font-bold text-[#0D278D] uppercase flex items-center gap-2">
                <FileText size={14} className="text-[#0D278D]" /> Vault Master Tautan Digital
              </h3>
            </div>

            {docStatus && (
              <div className={`p-3 rounded-xl flex items-center gap-3 mb-4 animate-in fade-in duration-300 ${docStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                <CheckCircle2 size={14} />
                <p className="text-[10px] font-bold">{docStatus.message}</p>
              </div>
            )}

            <div className="divide-y divide-gray-100/70">
              {documentTypes.map((type, idx) => {
                const existing = documents.find(d => d.type === type.key);
                const isSaving = isSavingDoc === type.key;

                return (
                  <div 
                    key={type.key} 
                    className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2 rounded-xl transition-colors duration-200 hover:bg-slate-50/40"
                  >
                    <div className="w-full sm:w-[38%] min-w-[280px] flex items-center gap-4 shrink-0">
                      <span className="font-mono text-xs text-[#0D278D] font-black opacity-60">0{idx + 1}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wide group-hover:text-[#0D278D] transition-colors truncate">
                          {type.label}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${existing ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${existing ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {existing ? 'Tautan Tersimpan' : 'Belum Ada Tautan'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-3 w-full">
                      <div className="relative flex-1 group/input">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-[#0D278D] transition-colors">
                          <LinkIcon size={13} />
                        </div>
                        <input 
                          type="url"
                          value={docLinks[type.key] || ""}
                          onChange={(e) => setDocLinks({ ...docLinks, [type.key]: e.target.value })}
                          placeholder="https://drive.google.com/..."
                          className="w-full pl-9 pr-24 h-[44px] bg-white border border-gray-200 focus:border-[#0D278D] focus:ring-4 focus:ring-blue-50/50 text-xs font-medium text-gray-800 rounded-xl outline-none transition-all duration-200 shadow-sm"
                        />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                          <button
                            type="button"
                            onClick={() => handleSaveDocLink(type.key)}
                            disabled={isSaving || !docLinks[type.key]}
                            className="h-[32px] px-4 rounded-lg bg-[#0D278D] text-white text-[9px] font-extrabold uppercase tracking-wider hover:bg-[#FEB700] hover:text-[#0D278D] transition-all duration-200 disabled:opacity-30 flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            {isSaving ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                            <span>{existing ? 'Update' : 'Simpan'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Tombol Aksi (Buka & Hapus) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {existing && (
                          <>
                            <a 
                              href={existing.file_path} 
                              target="_blank" 
                              rel="noreferrer"
                              className="h-[44px] px-4 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#0D278D] hover:text-[#0D278D] text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                            >
                              <Eye size={13} /> <span>Buka</span>
                            </a>
                            <button 
                              type="button"
                              onClick={() => handleRemoveDoc(type.key, existing.id)}
                              className="h-[44px] w-[44px] rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-gray-100 flex gap-3">
               <AlertCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
               <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                 Pastikan tautan Google Drive Anda diatur ke <strong>"Siapa saja yang memiliki link"</strong> dengan akses <strong>"Pelihat"</strong> agar panitia seleksi dapat memverifikasi berkas Anda.
               </p>
            </div>
          </motion.section>

        </div>
      </motion.main>
    </div>
  );
};

export default UserProfile;