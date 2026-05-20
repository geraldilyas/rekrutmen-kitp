import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users } from "lucide-react";
import ApplicantTable from "./ApplicantTable";
import { useApplications } from "./hooks";

const ApplicantDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const {
    getApplicationsByJobId,
    search,
    setSearch,
    filterStage,
    setFilterStage,
  } = useApplications();

  const applicants = getApplicationsByJobId(Number(jobId));
  const jobTitle = applicants[0]?.job_title || "Lowongan";

  const tabs = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Proses" },
    { key: "lulus", label: "Lulus" },
    { key: "tidak_lulus", label: "Tidak Lulus" },
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
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">
            {applicants.length} pelamar
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl w-fit">
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
      <ApplicantTable applicants={applicants} />
    </div>
  );
};

export default ApplicantDetail;
