import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  GraduationCap, 
  FileCheck, 
  ExternalLink, 
  Lock, 
  Calendar,
  Camera,
  Loader2,
  UserCheck
} from "lucide-react";
import { api } from "../../services/api";

interface UserProfile {
  name: string;
  email: string;
  nim_npm?: string;
  jurusan_prodi?: string;
  universitas?: string;
  created_at: string;
  avatar_url?: string;
}

interface UserDocument {
  type: string;
  file_path: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, } }
};

const Profil: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileAndDocs();
  }, []);

  const fetchProfileAndDocs = async () => {
    try {
      setLoading(true);
      const userRaw = localStorage.getItem("user"); 
      const userData = userRaw ? JSON.parse(userRaw) : null;

      setProfile({
        name: userData?.name || "Muhammad",
        email: userData?.email || "muhammad@student.unila.ac.id",
        nim_npm: userData?.nim_npm || "2217051000",
        jurusan_prodi: userData?.jurusan_prodi || "Informatika",
        universitas: userData?.universitas || "Universitas Lampung",
        created_at: userData?.created_at ? new Date(userData.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "24 Mei 2026",
        avatar_url: userData?.avatar_url || "" 
      });

      const resApps = await api.get("/applications/my");
      const myApps = Array.isArray(resApps.data) ? resApps.data : resApps.data.data || [];
      
      if (myApps.length > 0 && myApps[0].documents) {
        setDocuments(myApps[0].documents);
      } else {
        setDocuments([
          { type: "KTP", file_path: "" },
          { type: "CV / Daftar Riwayat Hidup", file_path: "" },
          { type: "Ijazah Terakhir", file_path: "" },
          { type: "Transkrip Nilai", file_path: "" }
        ]);
      }
    } catch (err) {
      console.error("Gagal memuat profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar! Maksimal 2MB bro.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updatedAvatarUrl = res.data.avatar_url;
      if (profile) {
        setProfile({ ...profile, avatar_url: updatedAvatarUrl });
      }
      
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const currentUser = JSON.parse(userRaw);
        currentUser.avatar_url = updatedAvatarUrl;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error("Gagal mengunggah foto profil:", err);
      const localImageUrl = URL.createObjectURL(file);
      if (profile) setProfile({ ...profile, avatar_url: localImageUrl });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D]"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-28 pb-20 font-['Poppins'] text-gray-800">
      
      {/* 🔮 INJEKSI CSS KEYFRAMES: Biar warna gradasi garis atasnya bisa gerak berganti otomatis */}
      <style>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-line {
          background-size: 200% 200%;
          animation: gradientWave 4s ease infinite;
        }
      `}</style>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        className="hidden" 
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        
        {/* --- LEFT SIDEBAR CARD: FOTO & IDENTITAS AKUN --- */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-[0_15px_40px_-25px_rgba(13,39,141,0.06)] flex flex-col items-center text-center relative overflow-hidden">
            
            {/* 🚀 FIX TOTAL: Garis horizontal atas interaktif yang berubah warna otomatis (Biru -> Kuning) */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#0D278D] via-[#FEB700] to-[#0D278D] animate-gradient-line" />
            
            {/* COMPONENT: INTERAKTIF AVATAR DENGAN TOMBOL KAMERA */}
            <div className="relative group/avatar mb-6 cursor-pointer mt-2" onClick={handleAvatarClick}>
              <div className="w-28 h-28 rounded-3xl bg-blue-50 border-2 border-dashed border-blue-200 overflow-hidden flex items-center justify-center text-[#0D278D] text-4xl font-black shadow-inner relative transition-all duration-300 group-hover/avatar:border-[#0D278D]">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  profile?.name.charAt(0)
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-2xl" />
              </div>
              
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#0D278D] text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover/avatar:scale-110 border-4 border-white">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </div>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
              <UserCheck size={12} className="text-[#0D278D]" />
              <span className="text-[10px] font-bold text-[#0D278D] uppercase tracking-wider">Akun Terverifikasi</span>
            </div>

            <h3 className="text-xl font-black text-[#0D278D] tracking-tight">{profile?.name}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pelamar Swadaya</p>
            
            <div className="w-full border-t border-gray-100 my-6" />
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-gray-500 text-xs font-medium">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <span className="truncate text-gray-600">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-xs font-medium">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <span className="text-gray-600">Registrasi: {profile?.created_at}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100/70 flex gap-4 items-start shadow-[0_10px_30px_-20px_rgba(0,0,0,0.02)]">
            <Lock size={18} className="text-[#0D278D] mt-0.5 shrink-0" />
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Data diri dan berkas digital tersimpan aman di cloud vault dan terenkripsi secara otomatis oleh sistem keamanan internal BBWSMS.
            </p>
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN CONTENT --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Informasi Akademik */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-black text-[#0D278D] tracking-tight uppercase flex items-center gap-2.5">
              <GraduationCap size={20} className="text-[#FEB700]" />
              Kualifikasi Pendidikan
            </h2>
            <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-[0_15px_40px_-25px_rgba(13,39,141,0.04)] grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Universitas / Institusi</p>
                <p className="font-extrabold text-gray-700 text-[15px]">{profile?.universitas || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Jurusan / Program Studi</p>
                <p className="font-extrabold text-gray-700 text-[15px]">{profile?.jurusan_prodi || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Nomor Induk Mahasiswa (NIM / NPM)</p>
                <p className="font-mono font-bold text-[#0D278D] text-[14px] tracking-wide bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block mt-1">
                  {profile?.nim_npm || "-"}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Vault Cloud Berkas */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-black text-[#0D278D] tracking-tight uppercase flex items-center gap-2.5">
              <FileCheck size={20} className="text-[#FEB700]" />
              Vault Berkas Administrasi
            </h2>
            
            <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-[0_15px_40px_-25px_rgba(13,39,141,0.04)]">
              <div className="divide-y divide-gray-100">
                {documents.map((doc, idx) => (
                  <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-gray-300">0{idx + 1}.</span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">{doc.type}</h4>
                        {doc.file_path ? (
                          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Tautan Cloud Sinkron
                          </p>
                        ) : (
                          <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Belum Diunggah
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {doc.file_path && (
                      <a 
                        href={doc.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0D278D] bg-blue-50 border border-blue-100 rounded-xl hover:bg-[#0D278D] hover:text-white transition-all duration-300 cursor-pointer self-start sm:self-auto shadow-sm"
                      >
                        <span>Cek Dokumen</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

        </div>
      </motion.main>
    </div>
  );
};

export default Profil;