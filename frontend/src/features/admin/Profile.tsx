import React, { useState, useEffect } from "react";
import { User, Mail, Save, AlertCircle, CheckCircle2, Shield, Network, Lock } from "lucide-react";
import { useProfile } from "../shared/profileHooks";

const AdminProfile: React.FC = () => {
  const { user, loading, updateProfile, changePassword } = useProfile();
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

  if (loading && !user) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0D278D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Poppins']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola informasi akun Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-inner">
              <User size={40} className="text-[#0D278D]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-xs text-gray-400 font-medium">{user?.email}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-[#0D278D]/10 text-[#0D278D] rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={12} />
                Lvl {user?.admin_level || '-'} Admin
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Network size={16} className="text-[#FEB700]" />
              Informasi Jabatan
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</p>
                <p className="text-sm font-semibold text-gray-700 capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tingkat Otoritas</p>
                <p className="text-sm font-semibold text-gray-700">Administrator Level {user?.admin_level || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {status && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-bold">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0D278D] transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#0D278D] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#FEB700] shadow-md hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock size={16} className="text-[#FEB700]" />
              Keamanan Kata Sandi
            </h3>

            {pwdStatus && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
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

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isChangingPwd}
                  className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-black shadow-md hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isChangingPwd ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock size={18} />
                  )}
                  <span>Perbarui Kata Sandi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
