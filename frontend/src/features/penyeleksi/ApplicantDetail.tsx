import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users, AlertCircle } from "lucide-react";
import ApplicantTable from "./ApplicantTable";
import StageUpdateModal from "./StageUpdateModal";
import { usePenyeleksiApplications, useAssignedJobs } from "./hooks";
import type { Application, UpdateStageData } from "../shared/types";

const ApplicantDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const {
    getApplicationsByJobId,
    updateApplicationStage,
    search,
    setSearch,
    filterStage,
    setFilterStage,
    currentPenyeleksi,
  } = usePenyeleksiApplications();
  const { getJobById } = useAssignedJobs();
  const jobIdNum = Number(jobId);
  const assignedJob = getJobById(jobIdNum);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  if (!assignedJob) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/penyeleksi/jobs")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0D278D] text-sm"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-bold text-gray-700">Akses Ditolak</h3>
          <p className="text-sm text-gray-500">
            Anda tidak ditugaskan untuk lowongan ini.
          </p>
        </div>
      </div>
    );
  }

  const applicants = getApplicationsByJobId(jobIdNum);
  const stages = assignedJob.selection_stages;

  const handleSubmit = (data: UpdateStageData) => {
    updateApplicationStage(data);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/penyeleksi/jobs")}
        className="flex items-center gap-2 text-gray-500 hover:text-[#0D278D] text-sm"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {assignedJob.title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">
            {applicants.length} peserta
          </span>
          <span className="text-xs font-bold text-[#0D278D] bg-blue-50 px-2 py-0.5 rounded-full">
            {assignedJob.category === "tenaga_pendukung"
              ? "Tenaga Pendukung"
              : "Konsultan Individu"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {["all", "pending", "lulus", "tidak_lulus"].map((k) => (
            <button
              key={k}
              onClick={() => setFilterStage(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStage === k ? "bg-white text-[#0D278D] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {k === "all"
                ? "Semua"
                : k === "pending"
                  ? "Proses"
                  : k === "lulus"
                    ? "Lulus"
                    : "Tidak Lulus"}
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
            placeholder="Cari peserta..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D]"
          />
        </div>
      </div>

      <ApplicantTable
        applicants={applicants}
        onUpdate={(app) => {
          setSelected(app);
          setModalOpen(true);
        }}
      />

      <StageUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        application={selected}
        stages={stages}
        scorerName={currentPenyeleksi}
      />
    </div>
  );
};

export default ApplicantDetail;
