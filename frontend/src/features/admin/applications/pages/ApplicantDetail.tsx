import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users } from "lucide-react";
import ApplicantTable from "../components/ApplicantTable";
import StageUpdateModal from "../components/StageUpdateModal";
import { useApplications } from "../hooks/useApplications";
import type { Application, UpdateStageData } from "../../types";

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
  } = useApplications();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const applicants = getApplicationsByJobId(Number(jobId));
  const jobTitle = applicants[0]?.job_title || "Lowongan";

  // Stages untuk lowongan ini (bisa diambil dari jobs)
  const stages = [
    {
      id: "s1",
      name: "Seleksi Administrasi",
      description: "Verifikasi dokumen",
      order: 1,
    },
    {
      id: "s2",
      name: "Tes Kompetensi",
      description: "Ujian tertulis",
      order: 2,
    },
    {
      id: "s3",
      name: "Wawancara",
      description: "Wawancara teknis",
      order: 3,
    },
  ];

  const handleUpdateClick = (applicant: Application) => {
    setSelectedApplicant(applicant);
    setModalOpen(true);
  };

  const handleSubmit = (data: UpdateStageData) => {
    updateApplicationStage(data);
  };

  const statusTabs = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Proses" },
    { key: "diterima", label: "Diterima" },
    { key: "ditolak", label: "Ditolak" },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/applications")}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0D278D] transition-colors text-sm font-medium group w-fit"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#0D278D] group-hover:bg-blue-50 transition-all">
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </div>
          Kembali ke Daftar Lowongan
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {jobTitle}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-500 text-sm">Daftar pelamar</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0D278D] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              <Users size={11} />
              {applicants.length} pelamar
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStage(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStage === tab.key
                  ? "bg-white text-[#0D278D] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau NIK pelamar..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm outline-none focus:border-[#0D278D]/30 transition-all"
          />
        </div>
      </div>

      {/* Applicant Table */}
      <ApplicantTable
        applicants={applicants}
        onUpdateStage={handleUpdateClick}
      />

      {/* Modal */}
      <StageUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        application={selectedApplicant}
        stages={stages}
      />
    </div>
  );
};

export default ApplicantDetail;
