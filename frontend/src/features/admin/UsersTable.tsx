import React from "react";
import {
  Pencil,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  ShieldOff,
} from "lucide-react";
import type { User } from "../shared/types";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onBlacklist?: (user: User) => void;
}

const roleConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  admin: {
    label: "Admin",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  penyeleksi: {
    label: "Penyeleksi",
    color: "bg-blue-50 text-[#0D278D] border-blue-100",
    dot: "bg-[#0D278D]",
  },
  user: {
    label: "Pelamar",
    color: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

const UsersTable: React.FC<Props> = ({
  users,
  onEdit,
  onBlacklist,
}) => {
  if (users.length === 0)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
        <UserIcon size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Tidak ada user</p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="text-center px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-12">
                No
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Kontak
              </th>
              <th className="text-center px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-center px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, index) => {
              const role = roleConfig[user.role] || roleConfig.user;
              return (
                <tr key={user.id} className="hover:bg-gray-50/30">
                  <td className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0D278D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail size={10} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="space-y-1">
                      {user.phone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Phone size={11} />
                          {user.phone}
                        </p>
                      )}
                      {user.address && (
                        <p className="text-xs text-gray-500 flex items-start gap-1 line-clamp-1">
                          <MapPin size={11} className="mt-0.5" />
                          {user.address}
                        </p>
                      )}
                      {!user.phone && !user.address && (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold border ${role.color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${role.dot}`}
                      />
                      {role.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0D278D] hover:bg-blue-50 transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                      {onBlacklist && user.role === "user" && user.nik && (
                        <button
                          onClick={() => onBlacklist(user)}
                          title="Blokir NIK user ini"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                        >
                          <ShieldOff size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
