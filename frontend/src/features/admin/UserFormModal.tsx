import React, { useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react";
import type { User, UserFormData } from "../shared/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: User | null;
  mode: "add" | "edit";
}

const initialState: UserFormData = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone: "",
  address: "",
  role: "penyeleksi",
};

const roleOptions = [
  {
    value: "admin" as const,
    label: "Admin",
    icon: Shield,
    desc: "Akses penuh",
  },
  {
    value: "penyeleksi" as const,
    label: "Penyeleksi",
    icon: CheckCircle2,
    desc: "Input nilai peserta",
  },
];

const UserFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [form, setForm] = React.useState<UserFormData>(initialState);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof UserFormData, string>>
  >({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === "edit") {
        setForm({
          name: initialData.name,
          email: initialData.email,
          password: "",
          password_confirmation: "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          role: initialData.role,
        });
      } else {
        setForm(initialState);
      }
      setErrors({});
      setShowPassword(false);
      setShowConfirm(false);
      setIsSubmitting(false);
    }
  }, [isOpen, initialData, mode]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof UserFormData, string>> = {};
    if (!form.name.trim()) e.name = "Wajib diisi";
    if (!form.email.trim()) e.email = "Wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Format tidak valid";
    if (mode === "add" && !form.password) e.password = "Wajib diisi";
    if (form.password && form.password.length < 8)
      e.password = "Minimal 8 karakter";
    if (form.password !== form.password_confirmation)
      e.password_confirmation = "Tidak cocok";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit(form);
        onClose();
      } catch (err: any) {
        if (err.response?.data?.errors) {
            setErrors(err.response.data.errors);
        } else {
            setErrorMsg(err.response?.data?.message || "Terjadi kesalahan");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const [errorMsg, setErrorMsg] = React.useState("");

  const ic = (f: keyof UserFormData) =>
    `w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white outline-none transition-all ${errors[f] ? "border-red-200 focus:border-red-400" : "border-gray-200 focus:border-[#0D278D]"}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <div>
            <h2 className="font-bold text-gray-900">
              {mode === "add" ? "Tambah User" : "Edit User"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Role
            </label>
            {mode === "add" ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#0D278D] bg-blue-50 text-[#0D278D]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#0D278D] text-white">
                  <CheckCircle2 size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Penyeleksi</p>
                  <p className="text-[10px] opacity-70">
                    Hanya akun penyeleksi yang bisa ditambahkan di sini
                  </p>
                </div>
              </div>
            ) : (
              (() => {
                const current = roleOptions.find((opt) => opt.value === form.role);
                return (
                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-200 text-gray-500">
                      {current ? <current.icon size={16} /> : <Shield size={16} />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-700">{current?.label || form.role}</p>
                      <p className="text-[10px] opacity-70">
                        Role tidak dapat diubah setelah user dibuat
                      </p>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Nama
            </label>
            <div className="relative">
              <UserIcon
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="Nama lengkap"
                className={ic("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="user@kitp.go.id"
                className={ic("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Telepon
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="081234567890"
                className={ic("phone")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder={
                    mode === "add" ? "Min. 8 karakter" : "Kosongkan jika tidak"
                  }
                  className={ic("password") + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.password_confirmation}
                  onChange={(e) => {
                    setForm({ ...form, password_confirmation: e.target.value });
                    setErrors((p) => ({ ...p, password_confirmation: undefined }));
                  }}
                  placeholder="Ulangi password"
                  className={ic("password_confirmation") + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Alamat
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-3.5 text-gray-400"
              />
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                placeholder="Alamat lengkap"
                className={ic("address") + " resize-none"}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
