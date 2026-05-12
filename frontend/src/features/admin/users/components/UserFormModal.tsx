import React, { useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import type { User, UserFormData } from "../../types";

interface UserFormModalProps {
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
  nik: "",
  phone: "",
  address: "",
  role: "admin",
};

const UserFormModal: React.FC<UserFormModalProps> = ({
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

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === "edit") {
        setForm({
          name: initialData.name,
          email: initialData.email,
          password: "",
          password_confirmation: "",
          nik: initialData.nik || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
          role: "admin",
        });
      } else {
        setForm({ ...initialState, role: "admin" });
      }
      setErrors({});
      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [isOpen, initialData, mode]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Password wajib saat tambah, optional saat edit
    if (mode === "add" && !form.password) {
      newErrors.password = "Password wajib diisi";
    }

    // Jika password diisi (baik add maupun edit), validasi
    if (form.password) {
      if (form.password.length < 8) {
        newErrors.password = "Minimal 8 karakter";
      }
      if (form.password !== form.password_confirmation) {
        newErrors.password_confirmation = "Password tidak cocok";
      }
    }

    if (form.nik && form.nik.length !== 16) {
      newErrors.nik = "NIK harus 16 digit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...form, role: "admin" });
      onClose();
    }
  };

  const inputClass = (field: keyof UserFormData) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all outline-none ${
      errors[field]
        ? "border-red-200 focus:border-red-400"
        : "border-gray-100 focus:border-[#0D278D]"
    }`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-50 rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "add" ? "Tambah Admin" : "Edit Admin"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {mode === "add"
                ? "Tambahkan admin baru ke sistem"
                : "Perbarui data admin"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nama Lengkap
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
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Nama lengkap admin"
                className={inputClass("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
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
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="admin@kitp.go.id"
                className={inputClass("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* NIK & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                NIK
              </label>
              <input
                type="text"
                value={form.nik}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                  setForm({ ...form, nik: val });
                  setErrors((prev) => ({ ...prev, nik: undefined }));
                }}
                placeholder="16 digit NIK"
                className={inputClass("nik") + " font-mono tracking-wider"}
                maxLength={16}
              />
              {errors.nik && (
                <p className="text-red-500 text-xs mt-1.5">{errors.nik}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
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
                  className={inputClass("phone")}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Alamat
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-4 text-gray-400"
              />
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                placeholder="Alamat lengkap admin"
                className={inputClass("address") + " resize-none"}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {mode === "add" ? "Password" : "Ubah Password"}
              </h4>
              {mode === "edit" && (
                <span className="text-[10px] text-gray-400 font-medium">
                  (Kosongkan jika tidak ingin mengubah)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }}
                    placeholder={
                      mode === "add" ? "Min. 8 karakter" : "Password baru"
                    }
                    className={inputClass("password") + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.password_confirmation}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        password_confirmation: e.target.value,
                      });
                      setErrors((prev) => ({
                        ...prev,
                        password_confirmation: undefined,
                      }));
                    }}
                    placeholder="Ulangi password"
                    className={inputClass("password_confirmation") + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-lg shadow-blue-900/10"
            >
              {mode === "add" ? "Tambah Admin" : "Perbarui Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
