import React from "react";
import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Clock,
  User as UserIcon,
} from "lucide-react";
import type { User } from "../../types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleVerification: (id: number) => void;
}

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onDelete,
  onToggleVerification,
}) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <UserIcon size={32} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Tidak Ada Data Admin
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Klik <b>Tambah Admin</b> untuk menambahkan admin baru
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Admin
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">
                Kontak
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">
                NIK
              </th>
              <th className="text-center px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden xl:table-cell">
                Terdaftar
              </th>
              <th className="text-center px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/30 transition-colors group"
              >
                {/* Nama + Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0D278D] to-blue-700 text-white flex items-center justify-center font-bold text-[11px] shadow-sm shrink-0">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0D278D] transition-colors truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail size={10} />
                        <span className="truncate">{user.email}</span>
                      </p>
                    </div>
                  </div>
                </td>

                {/* Kontak */}
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="space-y-1">
                    {user.phone && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Phone size={11} className="text-gray-400 shrink-0" />
                        {user.phone}
                      </p>
                    )}
                    {user.address && (
                      <p className="text-xs text-gray-500 flex items-start gap-1 line-clamp-1">
                        <MapPin
                          size={11}
                          className="text-gray-400 shrink-0 mt-0.5"
                        />
                        {user.address}
                      </p>
                    )}
                    {!user.phone && !user.address && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </td>

                {/* NIK */}
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-xs font-mono text-gray-600 tracking-wider">
                    {user.nik || "—"}
                  </span>
                </td>

                {/* Status Verifikasi */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onToggleVerification(user.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all hover:scale-105 active:scale-95 ${
                      user.email_verified_at
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                    title={
                      user.email_verified_at
                        ? `Terverifikasi: ${formatDate(user.email_verified_at)}`
                        : "Klik untuk verifikasi"
                    }
                  >
                    {user.email_verified_at ? (
                      <BadgeCheck size={12} className="text-emerald-600" />
                    ) : (
                      <Clock size={12} />
                    )}
                    {user.email_verified_at ? "Verified" : "Unverified"}
                  </button>
                </td>

                {/* Tanggal Daftar */}
                <td className="px-6 py-4 hidden xl:table-cell">
                  <p className="text-xs text-gray-500">
                    {formatDate(user.created_at!)}
                  </p>
                </td>

                {/* Aksi */}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-xl text-gray-400 hover:text-[#0D278D] hover:bg-blue-50 transition-all"
                      title="Edit admin"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Hapus admin "${user.name}"?\n\nTindakan ini tidak dapat dibatalkan.`,
                          )
                        ) {
                          onDelete(user.id);
                        }
                      }}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Hapus admin"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
