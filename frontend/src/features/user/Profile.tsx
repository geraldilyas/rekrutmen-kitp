import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Mail, CreditCard, Save, AlertCircle, CheckCircle2, FileText, Trash2, Eye, Lock, Link as LinkIcon, Edit3 } from "lucide-react";
import { useProfile, useUserDocuments } from "../shared/profileHooks";

const UserProfile: React.FC = () => {
  const { user, loading: profileLoading, updateProfile, changePassword } = useProfile();
  const { documents, loading: docsLoading, saveDocumentLink, deleteDocument } = useUserDocuments();
  
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

  // Master Document Input State
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
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
      setStatus({ type: 'success', message: 'Profil berhasil diperbarui' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Gagal memperbarui profil' });
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
      setPwdStatus({ type: 'success', message: 'Kata sandi berhasil diubah' });
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

  if (profileLoading && !user) {
    return (
      <div className="pt-32 pb-20 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D278D]"></div>
      </div>
    );
  }

  const documentTypes = [
    { key: 'ktp', label: 'KTP (Kartu Tanda Penduduk)', icon: CreditCard },
    { key: 'cv', label: 'CV / Curriculum Vitae', icon: FileText },
    { key: 'ijazah', label: 'Ijazah Terakhir', icon: FileText },
    { key: 'transkrip', label: 'Transkrip Nilai', icon: FileText },
  ];

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto font-['Poppins']">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Data Diri & Keamanan */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#0D278D] to-blue-800 p-8 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                  <User size={40} className="text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-black tracking-tight">{user?.name}</h1>
                  <p className="text-blue-100 font-medium opacity-90 mt-1 uppercase tracking-widest text-[10px]">
                    Data Diri Pelamar
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {status && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-bold">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                      <CreditCard size={14} className="text-[#FEB700]" />
                      NIK
                    </label>
                    <input
                      type="text"
                      value={user?.nik || "Belum diisi"}
                      disabled
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-semibold cursor-not-allowed italic"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                      <Mail size={14} className="text-[#FEB700]" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                      <User size={14} className="text-[#FEB700]" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                      <Phone size={14} className="text-[#FEB700]" />
                      Nomor HP
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                    <MapPin size={14} className="text-[#FEB700]" />
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-[#0D278D] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#FEB700] hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#FEB700]">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0D278D]">Keamanan Akun</h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Ubah kata sandi Anda secara berkala</p>
              </div>
            </div>
            
            <div className="p-8">
              {pwdStatus && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  pwdStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {pwdStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-bold">{pwdStatus.message}</p>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kata Sandi Saat Ini</label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setFormDataPassword({ ...passwordData, current_password: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setFormDataPassword({ ...passwordData, new_password: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Konfirmasi Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setFormDataPassword({ ...passwordData, new_password_confirmation: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPwd}
                    className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-black shadow-md hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isChangingPwd ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={18} />}
                    <span>Perbarui Kata Sandi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Master Dokumen */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-lg font-bold text-[#0D278D] mb-1 flex items-center gap-2">
              <FileText size={20} className="text-[#FEB700]" />
              Repository Dokumen
            </h3>
            <p className="text-[10px] text-gray-400 font-medium mb-8 uppercase tracking-wider">
              Simpan tautan Drive sekali untuk semua lamaran
            </p>

            <div className="space-y-6">
              {documentTypes.map((type) => {
                const existing = documents.find(d => d.type === type.key);
                const isSaving = isSavingDoc === type.key;
                const Icon = type.icon;
                const hasError = docStatus?.type === 'error' && docStatus.key === type.key;
                const hasSuccess = docStatus?.type === 'success' && docStatus.key === type.key;

                return (
                  <div key={type.key} className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Icon size={14} className={existing ? "text-[#0D278D]" : "text-gray-300"} />
                        {type.label}
                      </label>
                      {existing && (
                        <button 
                          onClick={() => handleRemoveDoc(type.key, existing.id)}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      )}
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0D278D] transition-colors">
                        <LinkIcon size={16} />
                      </div>
                      <input 
                        type="url"
                        value={docLinks[type.key] || ""}
                        onChange={(e) => setDocLinks({ ...docLinks, [type.key]: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className={`w-full pl-12 pr-24 py-3.5 bg-gray-50 border-2 rounded-2xl text-xs font-medium outline-none transition-all ${
                          hasError ? 'border-rose-200 focus:border-rose-500' : 
                          hasSuccess ? 'border-emerald-200 focus:border-emerald-500' :
                          'border-gray-100 focus:border-[#0D278D] focus:bg-white'
                        }`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button
                          onClick={() => handleSaveDocLink(type.key)}
                          disabled={isSaving || !docLinks[type.key]}
                          className="px-4 py-2 rounded-xl bg-[#0D278D] text-white text-[10px] font-bold hover:bg-[#FEB700] hover:text-[#0D278D] transition-all disabled:opacity-30 flex items-center gap-1.5 shadow-sm"
                        >
                          {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={12} />}
                          {existing ? 'Update' : 'Simpan'}
                        </button>
                      </div>
                    </div>
                    
                    {existing && (
                      <div className="flex items-center gap-2 px-2">
                        <a 
                          href={existing.file_path} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-bold text-[#0D278D] hover:underline flex items-center gap-1"
                        >
                          <Eye size={12} /> Buka Tautan Drive
                        </a>
                      </div>
                    )}

                    {hasError && <p className="text-[9px] text-rose-500 font-bold px-2 italic">{docStatus?.message}</p>}
                    {hasSuccess && <p className="text-[9px] text-emerald-500 font-bold px-2 italic">{docStatus?.message}</p>}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                <strong className="block mb-1 uppercase tracking-tighter">💡 Tips:</strong>
                Pastikan status berbagi link Drive Anda telah diatur ke <strong>"Anyone with the link"</strong> (Pelihat) agar dapat diverifikasi oleh admin.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
