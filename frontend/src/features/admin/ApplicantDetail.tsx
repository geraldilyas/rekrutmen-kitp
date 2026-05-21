import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users, Briefcase } from "lucide-react";
import ApplicantTable from "./ApplicantTable";
import StageUpdateModal from "../penyeleksi/StageUpdateModal";
import ApplicantDetailModal from "./ApplicantDetailModal";
import { useApplications } from "./hooks";
import type { Application, UpdateStageData } from "../shared/types";

const ApplicantDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const {
    getApplicationsByJobId,
    getJobById,
    startApplicationStage,
    updateStage,
    search,
    setSearch,
    filterStage,
    setFilterStage,
    loading,
  } = useApplications();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [initLoading, setInitLoading] = useState<number | null>(null);

  const jobIdNum = Number(jobId);
  const applicants = getApplicationsByJobId(jobIdNum);
  const job = getJobById(jobIdNum);
  const jobTitle = job?.title || applicants[0]?.job_title || "Lowongan";
  const stages = job?.selection_stages || [];

  const scorerName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.name || "Admin";
    } catch {
      return "Admin";
    }
  })();

  const handleOpenGrade = async (app: Application) => {
    if (app.current_stage_result_id) {
      setSelected(app);
      setModalOpen(true);
      return;
    }
    // No pending stage result yet — create it first
    setInitLoading(app.id);
    try {
      const newId = await startApplicationStage(app.id);
      if (newId) {
        setSelected({ ...app, current_stage_result_id: newId });
        setModalOpen(true);
      }
    } finally {
      setInitLoading(null);
    }
  };

  const handleSubmit = async (data: UpdateStageData) => {
    setSubmitting(true);
    try {
      await updateStage(data);
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Proses" },
    { key: "seleksi", label: "Seleksi" },
    { key: "Lulus", label: "Lulus" },
    { key: "Tidak Lulus", label: "Tidak Lulus" },
  ];

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/admin/applications")}
        className="flex items-center gap-2 text-gray-500 hover:text-[#0D278D] text-sm"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{jobTitle}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="text-sm text-gray-500">
            {applicants.length} pelamar
          </span>
          {stages.length > 0 && (
            <span className="text-xs font-semibold text-[#0D278D] bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Briefcase size={10} />
              {stages.length} tahap seleksi
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-1 p-1 bg-gray-50 rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterStage(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStage === t.key ? "bg-white text-[#0D278D] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
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

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D] mx-auto" />
        </div>
      ) : applicants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Belum ada pelamar untuk lowongan ini</p>
        </div>
      ) : (
        <ApplicantTable
          applicants={applicants}
          onView={(app) => setViewApp(app)}
        />
      )}

      <ApplicantDetailModal
        application={viewApp}
        stages={stages}
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
        scorerName={scorerName}
      />
    </div>
  );
};

export default ApplicantDetail;
