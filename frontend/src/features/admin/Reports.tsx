import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Upload,
  Calendar,
  Search,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  FileSpreadsheet,
  Megaphone,
  Send,
  Zap,
} from "lucide-react";
import { api } from "../../services/api";

interface Job {
  id: number;
  title: string;
  deadline: string;
  applications_count: number;
  unit_kerja: string;
}

interface Announcement {
  id: number;
  job_id: number;
  title: string;
  file_path: string;
  published_at: string;
}

const Reports: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [announcements, setAnnouncements] = useState<{ [key: number]: Announcement[] }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [uploadJobId, setUploadJobId] = useState<number | null>(null);
  const [isPublishing, setIsPublishing] = useState<number | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports/closed-jobs");
      setJobs(res.data.data);
      
      // Fetch announcements for each job
      res.data.data.forEach((job: Job) => fetchAnnouncements(job.id));
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async (jobId: number) => {
    try {
      const res = await api.get(`/admin/reports/announcements/${jobId}`);
      setAnnouncements(prev => ({ ...prev, [jobId]: res.data.data }));
    } catch (err) {
      console.error(`Error fetching announcements for job ${jobId}:`, err);
    }
  };

  const handleExport = async (jobId: number, type: 'excel' | 'pdf', passedOnly: boolean = false) => {
    try {
      const urlParams = passedOnly ? "?passed_only=1" : "";
      const response = await api.get(`/admin/reports/export/${jobId}/${type}${urlParams}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = type === 'excel' ? 'xlsx' : 'pdf';
      const suffix = passedOnly ? '-lulus' : '';
      link.setAttribute('download', `laporan-pelamar-${jobId}${suffix}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error("Export failed:", err);
      alert("Gagal mengunduh laporan. Pastikan data sudah tersedia.");
    }
  };

  const handleOneClickPublish = async (jobId: number) => {
    if (announcements[jobId]?.length) {
      alert("Pengumuman sudah diterbitkan untuk lowongan ini.");
      return;
    }

    if (!window.confirm("Terbitkan pengumuman kelulusan secara otomatis? Sistem akan membuatkan PDF daftar peserta lulus dan merangkingnya berdasarkan nilai tertinggi.")) return;
    
    setIsPublishing(jobId);
    setStatus(null);

    try {
      await api.post(`/admin/reports/publishPassedResults/${jobId}`);
      setStatus({ type: 'success', message: "Pengumuman hasil seleksi berhasil diterbitkan secara otomatis!" });
      fetchAnnouncements(jobId);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || "Gagal menerbitkan pengumuman otomatis" });
    } finally {
      setIsPublishing(null);
    }
  };

  const handleUploadAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadJobId || !uploadFile) return;

    setIsSaving(true);
    setStatus(null);
    
    const formData = new FormData();
    formData.append("job_id", uploadJobId.toString());
    formData.append("title", uploadTitle);
    formData.append("file", uploadFile);

    try {
      await api.post("/admin/reports/announcements", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatus({ type: 'success', message: "Pengumuman berhasil diterbitkan!" });
      setUploadJobId(null);
      setUploadTitle("");
      setUploadFile(null);
      fetchAnnouncements(uploadJobId);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || "Gagal menerbitkan pengumuman" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-['Poppins']">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Laporan & Pengumuman</h1>
          <p className="text-sm text-gray-500 font-medium">Ekspor data pelamar dan terbitkan pengumuman. Pengumuman hanya tersedia untuk lowongan yang telah melewati deadline dan seluruh tahapan seleksi.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari lowongan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium w-full md:w-64 focus:border-[#0D278D] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#0D278D]" size={32} />
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                
                {/* Info Lowongan */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-[#0D278D] text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                      {job.unit_kerja}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">{job.title}</h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Total Pelamar: <span className="text-[#0D278D]">{job.applications_count}</span>
                  </p>
                  
                  {/* Daftar Pengumuman Eksisting */}
                  <div className="pt-4 space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pengumuman Terbit:</p>
                    {announcements[job.id]?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {announcements[job.id].map((ann) => (
                          <a 
                            key={ann.id}
                            href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/storage/${ann.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-white hover:text-[#0D278D] hover:border-[#0D278D]/30 transition-all"
                          >
                            <Megaphone size={12} /> {ann.title} <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300 italic">Belum ada pengumuman yang diterbitkan.</p>
                    )}
                  </div>
                </div>

                {/* Aksi: Ekspor & Upload */}
                <div className="flex flex-wrap lg:flex-col justify-end gap-3 lg:w-64">
                  <p className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest lg:text-right">Ekspor Data Pelamar:</p>
                  <button 
                    onClick={() => handleExport(job.id, 'excel')}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <FileSpreadsheet size={16} /> Excel
                  </button>
                  <button 
                    onClick={() => handleExport(job.id, 'excel', true)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <FileSpreadsheet size={16} /> Excel (Lulus)
                  </button>
                  <button 
                    onClick={() => handleExport(job.id, 'pdf')}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  >
                    <FileText size={16} /> PDF
                  </button>
                  <button 
                    onClick={() => handleExport(job.id, 'pdf', true)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                  >
                    <FileText size={16} /> PDF (Lulus)
                  </button>
                  <div className="w-full h-px bg-gray-100 my-2" />
                  <button 
                    onClick={() => setUploadJobId(job.id)}
                    disabled={!!announcements[job.id]?.length}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#0D278D] text-[#0D278D] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 transition-all shadow-sm"
                  >
                    <Upload size={16} /> Upload Manual
                  </button>
                  <button 
                    onClick={() => handleOneClickPublish(job.id)}
                    disabled={isPublishing === job.id || !!announcements[job.id]?.length}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0D278D] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FEB700] hover:text-[#0D278D] disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-md group"
                  >
                    {isPublishing === job.id ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className={`${!!announcements[job.id]?.length ? 'text-gray-300' : 'text-[#FEB700] group-hover:text-[#0D278D]'}`} />}
                    <span>{!!announcements[job.id]?.length ? "Sudah Terbit" : "Terbitkan Otomatis"}</span>
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
            <FileText className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Tidak ada lowongan ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal Upload Pengumuman */}
      {uploadJobId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setUploadJobId(null)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 overflow-hidden"
          >
             {/* Minimalist Top Animated Gradient Line */}
             <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#0D278D] via-[#FEB700] to-[#0D278D]" />

            <h3 className="text-2xl font-black text-gray-900 mb-2">Terbitkan Pengumuman</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">
              {jobs.find(j => j.id === uploadJobId)?.title}
            </p>

            <form onSubmit={handleUploadAnnouncement} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Judul Pengumuman</label>
                <input 
                  type="text" 
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Hasil Seleksi Administrasi"
                  className="w-full bg-slate-50 border-b-2 border-gray-100 focus:border-[#0D278D] text-sm font-bold text-gray-800 p-4 outline-none transition-all rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">File Dokumen (PDF/Excel)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="announcement-file"
                    accept=".pdf,.xlsx,.xls,.doc,.docx"
                    required
                  />
                  <label 
                    htmlFor="announcement-file"
                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-100 group-hover:border-[#0D278D]/30 bg-slate-50 rounded-2xl cursor-pointer transition-all"
                  >
                    <Download className="text-gray-300 group-hover:text-[#0D278D]" size={32} />
                    <p className="text-xs font-bold text-gray-400">
                      {uploadFile ? uploadFile.name : "Klik untuk pilih file"}
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setUploadJobId(null)}
                  className="flex-1 px-6 py-4 rounded-full text-sm font-black uppercase tracking-widest text-gray-500 border border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-[#0D278D] text-white px-6 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#FEB700] hover:text-[#0D278D] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  <span>Terbitkan</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reports;
