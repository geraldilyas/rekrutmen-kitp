import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import JobsTable from "./JobsTable";
import JobFormModal from "./JobFormModal";
import { useJobsManagement, useUsersManagement } from "./hooks";
import type { Job, JobFormData } from "../shared/types";

const statusTabs = [
  { key: "all", label: "Semua" },
  { key: "active", label: "Berlangsung" },
  { key: "coming_soon", label: "Coming Soon" },
  { key: "finished", label: "Selesai" },
];

const JobsManage: React.FC = () => {
  const {
    jobs,
    totalJobs,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    addJob,
    editJob,
    deleteJob,
  } = useJobsManagement();
  const { users } = useUsersManagement();
  const availablePenyeleksi = users.filter((u) => u.role === "penyeleksi");

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleAdd = () => {
    setMode("add");
    setSelectedJob(null);
    setModalOpen(true);
  };
  const handleEdit = (job: Job) => {
    setMode("edit");
    setSelectedJob(job);
    setModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (window.confirm("Hapus lowongan ini?")) deleteJob(id);
  };

  const handleSubmit = (data: JobFormData) => {
    const names = availablePenyeleksi
      .filter((u) => data.penyeleksi_ids.includes(u.id))
      .map((u) => u.name);
    if (mode === "add") addJob(data, names);
    else if (selectedJob) editJob(selectedJob.id, data, names);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Lowongan</h1>
          <p className="text-gray-500 text-sm mt-1">{totalJobs} lowongan</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0D278D] text-white rounded-xl font-semibold text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm"
        >
          <Plus size={18} />
          Tambah Lowongan
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === tab.key ? "bg-white text-[#0D278D] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
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
            placeholder="Cari lowongan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D]"
          />
        </div>
      </div>

      <JobsTable jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />

      <JobFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedJob}
        mode={mode}
        availablePenyeleksi={availablePenyeleksi}
      />
    </div>
  );
};

export default JobsManage;
