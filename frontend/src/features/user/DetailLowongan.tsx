import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  UserPlus,
  Banknote,
  ClipboardList,
  Info,
  Briefcase,
  FileText,
  Send,
  AlertCircle,
  Zap,
  Megaphone,
  Loader2,
  User,
  ListChecks,
  CircleDot,
} from "lucide-react";
import { api } from "../../services/api";
import { useUserDocuments } from "../shared/profileHooks";

interface JobStageInfo {
  id: number | string;
  name: string;
  stage_order: number;
  start_date: string | null;
  end_date: string | null;
  is_active?: boolean;
}

interface JobDetail {
  id: number;
  title: string;
  category: string;
  type: string;
  description: string;
  qualification: string;
  duration: string;
  location: string;
  unit_kerja: string;
  recruiter_name: string | null;
  requirements: string;
  deadline: string | null;
  start_date?: string;
  end_date?: string;
  required_documents: string[] | string;
  form_fields: Array<{
    id: number;
    label: string;
    type: string;
    category: string;
    is_required: boolean;
  }>;
  announcements: Array<{
    id: number;
    title: string;
    file_path: string;
    published_at: string;
  }>;
  stages?: JobStageInfo[];
  selection_stages?: JobStageInfo[];
}

interface Application {
  id: number;
  job_id: number;
  status: string;
}

const DetailLowongan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { documents: masterDocs } = useUserDocuments();

  // Application & Form State
  const isLoggedIn = !!localStorage.getItem("token");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: number]: { field_id: number; label: string; value: string; is_required: boolean; category: "data_diri" | "berkas" }
  }>({});
  const [adminStage, setAdminStage] = useState<any>(null);

  const fetchJobDetail = async (jobId: string, token: string | null) => {
    try {
      setLoading(true);

      const jobResponse = await api.get(`/jobs/${jobId}`);
      const responseData = jobResponse.data;
      const jobData = responseData.data || responseData;
      setJob(jobData);

      const stages = jobData.stages || jobData.selection_stages || [];
      const foundAdminStage = stages.find(
        (s: any) => (s.name || "").trim().toLowerCase() === "seleksi administrasi"
      );
      setAdminStage(foundAdminStage || null);

      const stageDocs = (foundAdminStage?.documents || []).map((d: any) => ({
        id: d.id,
        label: d.label,
        type: d.type,
        is_required: d.is_required,
        category: "berkas",
      }));

      let dynamicFields =
        jobData.form_fields ||
        jobData.formFields ||
        jobData.job_form_fields ||
        jobData.jobFormFields ||
        [];

      if (!dynamicFields || dynamicFields.length === 0) {
        const dataDiriDefaults = [
          { id: 1, label: "Nama Lengkap", type: "text", is_required: 1, category: "data_diri" },
          { id: 2, label: "Email Aktif", type: "email", is_required: 1, category: "data_diri" },
          { id: 5, label: "Pendidikan Terakhir", type: "text", is_required: 1, category: "data_diri" },
        ];
        dynamicFields = [...dataDiriDefaults, ...stageDocs];
      }


      const initialAnswersState: any = {};

      dynamicFields.forEach((field: any, index: number) => {
        const actualFieldId = field.id || field.form_field_id || (index + 1);

        initialAnswersState[actualFieldId] = {
          field_id: Number(actualFieldId),
          label: field.label || field.name || "Input Persyaratan",
          value: "",
          is_required: field.is_required === 1 || field.is_required === true || field.is_required === "1",
          category: field.category === "berkas" ? "berkas" : "data_diri"
        };
      });

      setUploadedFiles(initialAnswersState);

      if (token) {
        try {
          const appsResponse = await api.get("/applications/my");
          const myApps: Application[] = Array.isArray(appsResponse.data)
            ? appsResponse.data
            : appsResponse.data.data || [];

          setAlreadyApplied(myApps.some((a) => String(a.job_id) === jobId));
        } catch (appErr) {
          console.error("Gagal memuat status lamaran user, tetapi detail lowongan tetap ditampilkan:", appErr);
          setAlreadyApplied(false); // Default jika backend error
        }
      }

    } catch (err) {
      console.error("Error fetching job detail (Main Job API Error):", err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (id) {
      fetchJobDetail(id, token);
    }
  }, [id]);

  const handleLinkChange = (fieldId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles({
      ...uploadedFiles,
      [fieldId]: {
        ...uploadedFiles[fieldId],
        value: e.target.value
      }
    });
  };

  const applyMasterDoc = (fieldId: number, label: string) => {
    const typeLower = label.toLowerCase();
    const found = masterDocs.find(d =>
      typeLower.includes(d.type.toLowerCase()) ||
      d.type.toLowerCase().includes(typeLower)
    );

    if (found) {
      setUploadedFiles({
        ...uploadedFiles,
        [fieldId]: {
          ...uploadedFiles[fieldId],
          value: found.file_path
        }
      });
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const missingDocs = Object.values(uploadedFiles).filter(item => item.is_required && !item.value.trim());
    if (missingDocs.length > 0) {
      const missingLabels = missingDocs.map(d => d.label).join(", ");
      setApplyError(`Harap isi tautan berkas wajib berikut: ${missingLabels}`);
      return;
    }

    try {
      setApplyLoading(true);
      setApplyError("");

      const answersPayload = Object.values(uploadedFiles)
        .filter(item => item.value.trim() !== "")
        .map((item) => ({
          field_id: Number(item.field_id),
          value: item.value.trim()
        }));

      await api.post("/applications", {
        job_id: Number(id),
        answers: answersPayload
      });

      setApplySuccess(true);
      setAlreadyApplied(true);
      setShowApplyForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setApplyError(err?.response?.data?.message || "Gagal mengirim berkas lamaran.");
    } finally {
      setApplyLoading(false);
    }
  };

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu") return "Konsultan Individu";
    return cat;
  };

  const formatDeadline = (dateStr: string | null, startDateStr?: string) => {
    const now = new Date();

    if (startDateStr) {
      const start = new Date(startDateStr);
      if (now < start) {
        const diffTime = start.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) return `Buka dalam ${diffDays} Hari`;
        return "Segera Hadir";
      }
    }

    if (!dateStr) return "Sesuai ketentuan";
    const deadline = new Date(dateStr);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Sudah ditutup";
    if (diffDays === 0) return "Tutup hari ini";
    return `Tutup dalam ${diffDays} Hari`;
  };

  const isClosed = job?.deadline ? new Date() > new Date(job.deadline) : false;
  const isNotOpenYet = job?.start_date ? new Date() < new Date(job.start_date) : false;

  const formatShortDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const isSameDay = (d1Str: string | null, d2Str: string | null): boolean => {
    if (!d1Str || !d2Str) return false;
    const d1 = new Date(d1Str);
    const d2 = new Date(d2Str);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Tahap Seleksi: data ini murni informatif, otomatis mengikuti tahapan yang
  // ditambahkan admin pada lowongan (tidak terkait progres lamaran pengguna).
  const selectionStages: JobStageInfo[] = (job?.stages || job?.selection_stages || [])
    .filter((s) => s.is_active !== false)
    .slice()
    .sort((a, b) => (a.stage_order ?? 0) - (b.stage_order ?? 0));

  const getStageState = (stage: JobStageInfo): "selesai" | "aktif" | "upcoming" => {
    const now = new Date();
    const start = stage.start_date ? new Date(stage.start_date) : null;
    const end = stage.end_date ? new Date(stage.end_date) : null;

    if (start && end) {
      if (now > end) return "selesai";
      if (now >= start && now <= end) return "aktif";
      return "upcoming";
    }
    if (start && now >= start) return "aktif";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-['Poppins'] flex items-center justify-center">
        <div
          className="w-28 h-8 flex items-center justify-center overflow-hidden relative"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          <svg
            className="absolute w-[200%] h-full left-0"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="riverGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#0D278D" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            <motion.path
              d="M 0 20 Q 12.5 8, 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
              fill="none"
              stroke="url(#riverGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ x: 0 }}
              animate={{ x: -100 }}
              transition={{
                duration: 4.5,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </svg>
        </div>
      </div>
    );
  }
  if (!job) {
    return (
      <div className="bg-white min-h-screen font-['Poppins'] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0D278D]">Lowongan tidak ditemukan</h2>
        <button onClick={() => navigate("/lowongan")} className="mt-4 text-[#0D278D] font-bold hover:underline">
          Kembali ke Lowongan
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-['Poppins']">

      {/* --- HERO BANNER SECTION --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10">
        <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button
              onClick={() => navigate("/lowongan")}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium mb-10 group"
            >
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              Kembali ke Lowongan
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#FEB700] text-[#0D278D] text-xs font-bold tracking-widest uppercase shadow-sm">
                {getCategoryDisplay(job.category)}
              </span>
              <span className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 ${isNotOpenYet ? "border-amber-400/30 text-amber-400" : "border-blue-300/30 text-blue-100"}`}>
                <Clock size={14} /> {formatDeadline(job.deadline, job.start_date)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-8 max-w-4xl tracking-tight">
              {job.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-0">
        {job.announcements && job.announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#0D278D] to-blue-800 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FEB700] flex items-center justify-center text-[#0D278D] shadow-lg shadow-amber-500/20">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Pengumuman Resmi</h3>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Informasi Kelulusan & Hasil Seleksi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.announcements.map((ann) => (
                  <a
                    key={ann.id}
                    href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/storage/${ann.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-5 rounded-[24px] bg-white/10 border border-white/10 hover:bg-white/20 transition-all group/ann"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <FileText size={20} className="text-[#FEB700]" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{ann.title}</p>
                        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Terbit: {new Date(ann.published_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <Zap size={18} className="text-[#FEB700] opacity-0 group-hover/ann:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-8 space-y-16">
            <section>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-6 tracking-tight flex items-center gap-3">
                <Briefcase size={28} className="text-[#FEB700]" />
                Deskripsi Lowongan
              </h2>
              <div className="text-gray-600 leading-[1.8] text-[15px] md:text-[17px] text-justify font-normal whitespace-pre-line">
                {job.description}
              </div>
            </section>

            {job.qualification && (
              <section>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-8 tracking-tight flex items-center gap-3">
                  <GraduationCap size={28} className="text-[#FEB700]" />
                  Kualifikasi
                </h2>
                <div className="text-gray-600 leading-[1.7] text-[15px] md:text-[16px] whitespace-pre-line">
                  {job.qualification}
                </div>
              </section>
            )}

            {job.requirements && (
              <section>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-8 tracking-tight flex items-center gap-3">
                  <CheckCircle2 size={28} className="text-[#FEB700]" />
                  Persyaratan Jabatan
                </h2>
                <div className="text-gray-600 leading-[1.7] text-[15px] md:text-[16px] whitespace-pre-line">
                  {job.requirements}
                </div>
              </section>
            )}

            {selectionStages.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-2 tracking-tight flex items-center gap-3">
                  <ListChecks size={28} className="text-[#FEB700]" />
                  Tahap Seleksi
                </h2>
                <p className="text-gray-500 text-[13px] md:text-sm font-medium mb-10">
                  Berikut alur tahapan seleksi pada lowongan ini.
                </p>

                <div className="relative">
                  <div className="hidden md:block absolute top-[22px] left-[4%] right-[4%] h-[2px] bg-gray-100 z-0" />

                  <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-2 relative z-10 w-full">
                    {selectionStages.map((stage, index) => {
                      const state = getStageState(stage);

                      let circleClass = "bg-white border-2 border-gray-200 text-gray-300";
                      let titleClass = "text-gray-400 font-medium";
                      let statusLabel = "Akan Datang";
                      let StageIcon = CircleDot;

                      if (state === "selesai") {
                        circleClass = "bg-[#0D278D] border-[#0D278D] text-white shadow-[0_4px_15px_rgba(13,39,141,0.2)]";
                        titleClass = "text-[#0D278D] font-bold";
                        statusLabel = "Selesai";
                        StageIcon = CheckCircle2;
                      } else if (state === "aktif") {
                        circleClass = "bg-white border-[#FEB700] text-[#FEB700] ring-4 ring-yellow-50";
                        titleClass = "text-[#0D278D] font-bold";
                        statusLabel = "Sedang Berlangsung";
                        StageIcon = Clock;
                      }

                      return (
                        <div
                          key={stage.id}
                          className="flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:flex-1 shrink-0"
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${circleClass}`}
                          >
                            <StageIcon size={18} />
                          </div>

                          <div className="text-left md:text-center w-full md:px-2">
                            <p className="text-[10px] font-mono text-gray-300 mb-0.5">0{index + 1}</p>
                            <h3 className={`text-[13px] md:text-[14px] leading-snug ${titleClass}`}>
                              {stage.name}
                            </h3>
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{statusLabel}</p>
                            {(stage.start_date || stage.end_date) && (
                              <p className="text-[10px] text-gray-400 mt-1">
                                {formatShortDate(stage.start_date)}
                                {stage.end_date && !isSameDay(stage.start_date, stage.end_date) ? ` - ${formatShortDate(stage.end_date)}` : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </motion.div>

          {/* Action Sidebar Right Column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="lg:col-span-4">
            <div className="sticky top-32 lg:border-l-2 lg:border-gray-100 lg:pl-10 pb-8">
              <h3 className="text-xl font-extrabold text-[#0D278D] flex items-center gap-2 mb-8">
                <ClipboardList size={22} className="text-[#FEB700]" />
                Ringkasan Posisi
              </h3>

              <div className="space-y-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <CalendarClock size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Batas Waktu Pendaftaran</p>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      {job.deadline
                        ? `${new Date(job.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}, Pukul ${new Date(job.deadline).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <UserPlus size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Unit Kerja</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{job.unit_kerja || "BBWS Mesuji Sekampung"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <Banknote size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Masa Kontrak</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{job.duration || "-"}</p>
                  </div>
                </div>

                {job.recruiter_name && (
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                      <User size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Perekrut / Ketua Tim Seleksi</p>
                      <p className="font-semibold text-gray-800 text-[15px]">{job.recruiter_name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Feedback */}
              <AnimatePresence mode="wait">
                {applySuccess ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-green-50 border border-green-100 flex gap-3 mb-4">
                    <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-800 text-sm">Lamaran terkirim!</p>
                      <button onClick={() => navigate("/status")} className="text-[#0D278D] text-xs font-bold hover:underline mt-1">
                        Lihat Status Lamaran →
                      </button>
                    </div>
                  </motion.div>
                ) : alreadyApplied ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 mb-4">
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800 text-sm">Anda sudah melamar</p>
                      <button onClick={() => navigate("/status")} className="text-[#0D278D] text-xs font-bold hover:underline mt-1">
                        Cek Status →
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex gap-3 mb-6 text-gray-500">
                <Info size={18} className="shrink-0 mt-0.5 text-gray-400" />
                <p className="text-[13px] leading-relaxed">
                  Gunakan form pendaftaran di bawah untuk mengunggah dokumen digital pendaftaran Anda.
                </p>
              </div>

              {!isLoggedIn ? (
                <button onClick={() => navigate("/login")} className="w-full bg-white text-[#0D278D] border-2 border-[#0D278D] py-4 rounded-full font-bold text-[15px] hover:bg-[#0D278D] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Masuk untuk Melamar
                </button>
              ) : isNotOpenYet ? (
                <button disabled className="w-full bg-amber-50 text-amber-600 border-2 border-amber-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2">
                  <Clock size={18} /> Pendaftaran Belum Dibuka
                </button>
              ) : isClosed ? (
                <button disabled className="w-full bg-gray-100 text-gray-400 border-2 border-gray-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2">
                  Pendaftaran Ditutup
                </button>
              ) : alreadyApplied || applySuccess ? (
                <button disabled className="w-full bg-green-50 text-green-600 border-2 border-green-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Sudah Dilamar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(!showApplyForm);
                    setTimeout(() => {
                      document.getElementById("dynamic-form-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 150);
                  }}
                  className={`w-full py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 group cursor-pointer border-2
                    ${showApplyForm
                      ? "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                      : "bg-white border-[#0D278D] text-[#0D278D] hover:bg-[#0d278d] hover:text-white shadow-sm"
                    }`}
                >
                  <span>{showApplyForm ? "Sembunyikan Form" : "Lamar Posisi Ini"}</span>
                  {!showApplyForm && <Send size={16} className="transform group-hover:translate-x-1 transition-transform" />}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- DYNAMIC FORM EXPANSION --- */}
      <AnimatePresence>
        {showApplyForm && (
          <motion.div
            id="dynamic-form-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="relative">

                <div className="text-left mb-12 border-b border-gray-900 pb-6">
                  <h3 className="text-2xl font-extrabold text-[#0D278D] font-['Poppins']">
                    Formulir Lamaran
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
                    Lengkapi pertanyaan berikut, lalu lampirkan dokumen pendukung yang diwajibkan.
                  </p>
                </div>

                {applyError && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 rounded-lg text-red-600 text-xs flex gap-2 font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{applyError}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmitApplication} className="space-y-14">
                  {(() => {
                    const allFields = Object.values(uploadedFiles);
                    const questionFields = allFields.filter((f) => f.category !== "berkas");
                    const documentFields = allFields.filter((f) => f.category === "berkas");

                    const renderField = (fieldItem: typeof allFields[number], index: number) => {
                      let inputType = "text";
                      let placeholderText = `Masukkan ${fieldItem.label} Anda`;

                      if (fieldItem.label.toLowerCase().includes("email")) {
                        inputType = "email";
                        placeholderText = "Contoh: nama@email.com";
                      } else if (fieldItem.category === "berkas") {
                        inputType = "url";
                        placeholderText = `Salin tautan Google Drive / URL ${fieldItem.label} di sini`;
                      }

                      return (
                        <div key={fieldItem.field_id} className="group/row flex flex-col md:flex-row md:items-start border-b border-gray-100 pb-6 gap-2 md:gap-6 transition-colors duration-300 hover:border-gray-300">
                          <div className="w-full md:w-1/3 pt-3">
                            <label className="text-xs font-bold text-[#0D278D] uppercase flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#0D278D] font-mono text-[11px] font-normal">0{index + 1}.</span>
                                {fieldItem.label} {fieldItem.is_required && <span className="text-red-500/80">*</span>}
                              </div>
                              {fieldItem.category === "berkas" && (
                                <button
                                  type="button"
                                  onClick={() => applyMasterDoc(fieldItem.field_id, fieldItem.label)}
                                  className="text-[9px] bg-blue-50 text-[#0D278D] px-2 py-1 rounded hover:bg-[#0D278D] hover:text-white transition-all"
                                >
                                  Gunakan Master
                                </button>
                              )}
                            </label>
                          </div>

                          <div className="w-full md:w-2/3 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-gray-300 group-focus-within/row:text-[#0D278D] transition-colors pointer-events-none">
                              <FileText size={16} strokeWidth={2} />
                            </span>
                            <input
                              type={inputType}
                              placeholder={placeholderText}
                              value={fieldItem.value}
                              onChange={(e) => handleLinkChange(fieldItem.field_id, e)}
                              className="w-full bg-transparent border-b-2 border-gray-200 text-xs md:text-sm font-medium pl-8 pr-2 py-3 outline-none transition-all duration-300 focus:border-[#0D278D] text-gray-800"
                              required={fieldItem.is_required}
                            />
                          </div>
                        </div>
                      );
                    };

                    return (
                      <>
                        {questionFields.length > 0 && (
                          <div>
                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6">
                              1. Pertanyaan
                            </h4>
                            <div className="space-y-8">
                              {questionFields.map((f, i) => renderField(f, i))}
                            </div>
                          </div>
                        )}

                        {documentFields.length > 0 && (
                          <div>
                            <div className="mb-6">
                              <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                                2. Dokumen Pendukung
                              </h4>
                              <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
                                Silakan masukkan tautan Google Drive untuk masing-masing berkas yang diwajibkan di bawah ini.
                              </p>
                              {adminStage && (
                                <div className="mt-4 flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0D278D] border border-blue-100">
                                    <CheckCircle2 size={12} />
                                    Tahapan: {adminStage.name}
                                  </span>
                                  {adminStage.weight != null && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                      Bobot Penilaian: {adminStage.weight}%
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mb-8 p-6 bg-gray-50 border-l-2 border-[#0D278D] flex gap-4 items-start">
                              <div className="w-5 h-5 rounded-full bg-[#0D278D] flex items-center justify-center text-white shrink-0 mt-0.5">
                                <Info size={12} strokeWidth={2.5} />
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-[#0D278D] uppercase tracking-wider block">Petunjuk Akses Berbagi</span>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                  Pastikan status berbagi berkas telah diatur ke <span className="text-amber-600 font-bold">"Siapa saja yang memiliki link"</span> sebagai <span className="font-bold">Pelihat (Viewer)</span>.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-8">
                              {documentFields.map((f, i) => renderField(f, i))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <button type="button" disabled={applyLoading} onClick={() => setShowApplyForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all disabled:opacity-50">
                      Batalkan
                    </button>
                    <button type="submit" disabled={applyLoading} className="px-5 py-2.5 rounded-xl border border-[#0D278D] text-[#0D278D] text-xs font-bold uppercase tracking-wider hover:bg-[#0D278D] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {applyLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={12} /> Kirim Lamaran</>}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DetailLowongan;