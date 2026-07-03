import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import UsersTable from "./UsersTable";
import UserFormModal from "./UserFormModal";
import BlacklistUserModal from "./BlacklistUserModal";
import { useUsersManagement } from "./hooks";
import type { User, UserFormData } from "../shared/types";

const roleTabs = [
  { key: "all", label: "Semua" },
  { key: "admin", label: "Admin" },
  { key: "penyeleksi", label: "Penyeleksi" },
  { key: "user", label: "Pendaftar" },
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
    currentPage,
    lastPage,
    loading,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    filterVerification,
    setFilterVerification,
    setCurrentPage,
    addUser,
    editUser,
    toggleVerification,
    blacklistUser,
  } = useUsersManagement();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blacklistModalOpen, setBlacklistModalOpen] = useState(false);
  const [userToBlacklist, setUserToBlacklist] = useState<User | null>(null);

  const authUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = authUser.role === "admin";

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

  const handleSubmit = async (data: UserFormData) => {
    if (mode === "add") {
      await addUser(data);
    } else if (selectedUser) {
      await editUser(selectedUser.id, data, selectedUser.role);
    }
  };

  const handleBlacklist = (user: User) => {
    setUserToBlacklist(user);
    setBlacklistModalOpen(true);
  };

  const handleBlacklistSubmit = async (reason: string) => {
    if (!userToBlacklist) return;
    await blacklistUser(userToBlacklist.id, reason || undefined);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-500 text-sm mt-1">{totalUsers} user terdaftar</p>
        </div>
        {/* Only admin can add users */}
        {isAdmin && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0D278D] text-white rounded-xl font-semibold text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm"
          >
            <Plus size={18} />
            Tambah User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Role filter */}
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterRole(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterRole === tab.key
                  ? "bg-white text-[#0D278D] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Verification filter */}
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {verifyTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterVerification(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau NIK..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D] mx-auto" />
        </div>
      ) : (
        <>
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onToggleVerification={toggleVerification}
            onBlacklist={handleBlacklist}
          />

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-xs text-gray-500 font-medium">
                Halaman {currentPage} dari {lastPage}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={currentPage === lastPage || loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 rounded-xl bg-[#0D278D] text-white text-xs font-bold hover:bg-[#FEB700] hover:text-[#0D278D] disabled:opacity-50 transition-all"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal — only reachable by admin since the button is hidden for penyeleksi */}
      {isAdmin && (
        <UserFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedUser}
          mode={mode}
        />
      )}

      <BlacklistUserModal
        isOpen={blacklistModalOpen}
        onClose={() => setBlacklistModalOpen(false)}
        onSubmit={handleBlacklistSubmit}
        user={userToBlacklist}
      />
    </div>
  );
};

export default UsersManage;