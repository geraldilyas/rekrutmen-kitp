import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users } from "lucide-react";
import ApplicantTable from "./ApplicantTable";
import StageUpdateModal from "./StageUpdateModal";
import ApplicantDetailModal from "../admin/ApplicantDetailModal";
import { usePenyeleksiApplications, useAssignedJobs } from "./hooks";
import { api } from "../../services/api";
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
    loading,
  } = usePenyeleksiApplications();
  const { getJobById } = useAssignedJobs();
  const jobIdNum = Number(jobId);
  const assignedJob = getJobById(jobIdNum);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const applicants = getApplicationsByJobId(jobIdNum);
  const stages = assignedJob?.selection_stages || [];

  const handleOpenGrade = async (app: Application) => {
    if (app.current_stage_result_id) {
      setSelected(app);
      setModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/admin/applications/${app.id}/init-stage`);
      setSelected({ ...app, current_stage_result_id: res.data.data?.id ?? null });
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to init stage:", err);
    }
  };

  const handleSubmit = async (data: UpdateStageData) => {
    setSubmitting(true);
    try {
      await updateApplicationStage(data);
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/penyeleksi/jobs")}
        className="flex items-center gap-2 text-gray-500 hover:text-[#0D278D] text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {assignedJob?.title || "Lowongan"}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {applicants.length} peserta
            </span>
            {assignedJob && (
              <span className="text-xs font-bold text-[#0D278D] bg-blue-50 px-2 py-0.5 rounded-full">
                {assignedJob.category === "tenaga_pendukung"
                  ? "Tenaga Pendukung"
                  : "Konsultan Individu"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
            placeholder="Cari nama, email, atau NIK..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D] transition-colors shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D]" />
        </div>
      ) : applicants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-20 shadow-sm">
          <Users size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">Tidak ada peserta yang ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">Coba sesuaikan filter atau pencarian Anda</p>
        </div>
      ) : (
        <ApplicantTable
          applicants={applicants}
          onView={(app) => setViewApp(app)}
        />
      )}

      <ApplicantDetailModal
        application={viewApp}
        onClose={() => setViewApp(null)}
        onGrade={(app) => {
          setViewApp(null);
          handleOpenGrade(app);
        }}
      />

      <StageUpdateModal
        isOpen={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
        onSubmit={handleSubmit}
        application={selected}
        stages={stages}
        scorerName={currentPenyeleksi}
      />
    </div>
  );
};

export default ApplicantDetail;
