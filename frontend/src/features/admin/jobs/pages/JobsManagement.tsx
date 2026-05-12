import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import JobsTable from "../components/JobsTable";
import JobFormModal from "../components/JobFormModal";
import { useJobsManagement } from "../hooks/useJobsManagement";
import type { Job, JobFormData } from "../../types";

const statusTabs = [
  { key: "all", label: "Semua" },
  { key: "active", label: "Berlangsung" },
  { key: "coming_soon", label: "Coming Soon" },
  { key: "finished", label: "Selesai" },
];

const JobsManagement: React.FC = () => {
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
    if (mode === "add") addJob(data);
    else if (selectedJob) editJob(selectedJob.id, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Kelola Lowongan
          </h1>
          <p className="text-gray-500 text-sm mt-1">{totalJobs} lowongan</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#0D278D] text-white rounded-2xl font-semibold text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-lg shadow-blue-900/10 w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Tambah Lowongan
        </button>
      </div>

      {/* Status Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === tab.key
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
            placeholder="Cari judul, lokasi, unit kerja, atau perekrut..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm outline-none focus:border-[#0D278D]/30 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <JobsTable jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal */}
      <JobFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedJob}
        mode={mode}
      />
    </div>
  );
};

export default JobsManagement;
