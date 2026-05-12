import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import UsersTable from "../components/UsersTable";
import UserFormModal from "../components/UserFormModal";
import { useUsersManagement } from "../hooks/useUsersManagement";
import type { User, UserFormData } from "../../types";

const verifyTabs = [
  { key: "all", label: "Semua" },
  { key: "verified", label: "Verified" },
  { key: "unverified", label: "Unverified" },
];

const UsersManagement: React.FC = () => {
  const {
    users,
    totalUsers,
    search,
    setSearch,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Manajemen Admin
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Kelola akun admin sistem</p>
            <span className="text-xs font-bold text-[#0D278D] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {totalUsers} admin
            </span>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#0D278D] text-white rounded-2xl font-semibold text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-lg shadow-blue-900/10 w-full sm:w-auto justify-center active:scale-95"
        >
          <Plus size={18} />
          Tambah Admin
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Verification Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl">
          {verifyTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterVerification(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterVerification === tab.key
                  ? "bg-white text-[#0D278D] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, NIK, atau telepon..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm outline-none focus:border-[#0D278D]/30 transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      <UsersTable
        users={users}
        onEdit={handleEdit}
        onDelete={deleteUser}
        onToggleVerification={toggleVerification}
      />

      {/* Modal */}
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

export default UsersManagement;
