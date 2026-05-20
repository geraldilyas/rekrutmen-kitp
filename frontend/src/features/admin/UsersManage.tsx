import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import UsersTable from "./UsersTable";
import UserFormModal from "./UserFormModal";
import { useUsersManagement } from "./hooks";
import type { User, UserFormData } from "../shared/types";

const roleTabs = [
  { key: "all", label: "Semua" },
  { key: "admin", label: "Admin" },
  { key: "penyeleksi", label: "Penyeleksi" },
];

const verifyTabs = [
  { key: "all", label: "Semua" },
  { key: "verified", label: "Verified" },
  { key: "unverified", label: "Unverified" },
];

const UsersManage: React.FC = () => {
  const {
    users,
    totalUsers,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    filterVerification,
    setFilterVerification,
    addUser,
    editUser,
    deleteUser,
    toggleVerification,
  } = useUsersManagement();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAdd = () => {
    setMode("add");
    setSelectedUser(null);
    setModalOpen(true);
  };
  const handleEdit = (user: User) => {
    setMode("edit");
    setSelectedUser(user);
    setModalOpen(true);
  };
  const handleSubmit = (data: UserFormData) => {
    if (mode === "add") addUser(data);
    else if (selectedUser) editUser(selectedUser.id, data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-500 text-sm mt-1">{totalUsers} user</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0D278D] text-white rounded-xl font-semibold text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm"
        >
          <Plus size={18} />
          Tambah User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterRole(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterRole === tab.key ? "bg-white text-[#0D278D] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {verifyTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterVerification(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterVerification === tab.key ? "bg-white text-[#0D278D] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D]"
          />
        </div>
      </div>

      <UsersTable
        users={users}
        onEdit={handleEdit}
        onDelete={deleteUser}
        onToggleVerification={toggleVerification}
      />

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedUser}
        mode={mode}
      />
    </div>
  );
};

export default UsersManage;
