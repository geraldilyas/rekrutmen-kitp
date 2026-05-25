import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Mail, CreditCard, Save, AlertCircle, CheckCircle2, FileText, Upload, Trash2, Eye, ExternalLink, Lock } from "lucide-react";
import { useProfile, useUserDocuments } from "../shared/profileHooks";

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

  const handleFileUpload = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    try {
      await uploadDocument(type, file);
      setStatus({ type: 'success', message: `Berhasil mengunggah ${type.toUpperCase()}` });
    } catch (err: any) {
      setStatus({ type: 'error', message: `Gagal mengunggah ${type.toUpperCase()}` });
    } finally {
      setUploadingType(null);
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
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto font-['Poppins']">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Data Diri */}
        <div className="lg:col-span-2 space-y-8">
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
                    <div className="relative">
                      <input
                        type="text"
                        value={user?.nik || "Belum diisi"}
                        disabled
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-semibold cursor-not-allowed italic"
                      />
                    </div>
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

          {/* Card Keamanan Akun */}
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
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#0D278D] mb-1 flex items-center gap-2">
              <FileText size={20} className="text-[#FEB700]" />
              Dokumen Master
            </h3>
            <p className="text-[10px] text-gray-400 font-medium mb-6 uppercase tracking-wider">
              Unggah dokumen sekali untuk digunakan di semua lamaran
            </p>

            <div className="space-y-4">
              {documentTypes.map((type) => {
                const existing = documents.find(d => d.type === type.key);
                const isUploading = uploadingType === type.key;
                const Icon = type.icon;

                return (
                  <div key={type.key} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 group hover:border-[#0D278D]/20 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${existing ? 'bg-[#0D278D] text-white' : 'bg-white text-gray-400'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{type.label}</p>
                          <p className="text-[10px] text-gray-400">{existing ? existing.file_name : 'Belum diunggah'}</p>
                        </div>
                      </div>
                      {existing && (
                        <button 
                          onClick={() => deleteDocument(existing.id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {existing ? (
                      <div className="flex gap-2">
                        <a 
                          href={`/storage/${existing.file_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-gray-200 text-[#0D278D] text-[10px] font-bold hover:bg-blue-50 transition-all"
                        >
                          <Eye size={12} /> Lihat File
                        </a>
                      </div>
                    ) : (
                      <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border-2 border-dashed border-gray-200 text-gray-500 text-[10px] font-bold hover:border-[#0D278D] hover:text-[#0D278D] transition-all cursor-pointer">
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-blue-100 border-t-[#0D278D] rounded-full animate-spin" />
                        ) : (
                          <Upload size={12} />
                        )}
                        {isUploading ? 'Mengunggah...' : 'Unggah Dokumen'}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(type.key, e)}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;

