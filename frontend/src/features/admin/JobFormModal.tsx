import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import type { Job, JobFormData, SelectionStage, User } from "../shared/types";
import { api } from "../../services/api";

const ADMIN_STAGE_NAME = "Seleksi Administrasi";
const isAdminStage = (name: string) => name.trim().toLowerCase() === ADMIN_STAGE_NAME.toLowerCase();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => Promise<void> | void;
  initialData?: Job | null;
  mode: "add" | "edit";
  availablePenyeleksi: User[];
}

// 🚀 HELPER: Normalisasi berbagai format tanggal dari backend ("2026-06-01",
// "2026-06-01 09:00:00", "2026-06-01T09:00:00.000000Z", dst) menjadi format
// yang dibutuhkan input type="datetime-local": "YYYY-MM-DDTHH:mm"
const formatForInputDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  const normalized = dateStr.replace(" ", "T");
  const [datePart, timePart] = normalized.split("T");
  if (!datePart) return "";
  if (!timePart) return `${datePart}T00:00`;
  return `${datePart}T${timePart.slice(0, 5)}`;
};

const emptyForm: JobFormData = {
  title: "",
  category: "tenaga_pendukung",
  description: "",
  qualification: "",
  requirements: "",
  duration: "",
  location: "",
  unit_kerja: "",
  recruiter_name: "",
  penyeleksi_ids: [],
  start_date: "",
  end_date: "",
  kuota: "",
  form_fields: ["CV", "Ijazah"],
  selection_stages: [
    {
      id: "s-admin",
      name: "Seleksi Administrasi",
      description: "",
      order: 1,
      weight: 0,
      start_date: "",
      end_date: "",
      grading_end_date: "",
      test_link: null,
      documents: [],
    },
  ],
};

const JobFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  availablePenyeleksi,
}) => {
  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [searchPenyeleksi, setSearchPenyeleksi] = useState("");
  const [showPenyeleksi, setShowPenyeleksi] = useState(false);
  const [showStages, setShowStages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [availableDocuments, setAvailableDocuments] = useState<{ id: number; label: string }[]>([]);
  const [newDocLabel, setNewDocLabel] = useState("");
  const [addingDoc, setAddingDoc] = useState(false);

  const loadDocuments = () => {
    api
      .get("/admin/form-fields")
      .then((res) => {
        const fields = (res.data || []).filter((f: any) => f.category === "berkas");
        setAvailableDocuments(fields.map((f: any) => ({ id: f.id, label: f.label })));
      })
      .catch(() => setAvailableDocuments([]));
  };

  useEffect(() => {
    if (!isOpen) return;
    loadDocuments();
  }, [isOpen]);

  const handleAddDocument = async (stageId: string | number) => {
    if (!newDocLabel.trim()) return;
    setAddingDoc(true);
    try {
      const res = await api.post("/admin/form-fields", {
        label: newDocLabel.trim(),
        type: "url",
        is_required: true,
        category: "berkas",
      });
      const created = res.data?.data || res.data;
      setAvailableDocuments((prev) => [...prev, { id: created.id, label: created.label }]);
      toggleStageDocument(stageId, { id: created.id, label: created.label });
      setNewDocLabel("");
    } catch (err) {
      console.error("Gagal menambah dokumen:", err);
    } finally {
      setAddingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await api.delete(`/admin/form-fields/${docId}`);
      setAvailableDocuments((prev) => prev.filter((d) => d.id !== docId));
      setForm((p) => ({
        ...p,
        selection_stages: p.selection_stages.map((s) => ({
          ...s,
          documents: (s.documents || []).filter((d) => d.form_field_id !== docId),
        })),
      }));
    } catch (err) {
      console.error("Gagal menghapus dokumen:", err);
    }
  };

  // 🚀 FIXED LOGIC: Selalu sinkronkan form dari initialData saat modal dibuka
  // atau saat job yang diedit berganti. Guard lama (`if (prev.title) return prev`)
  // dibuang karena bikin form edit menampilkan sisa state lama (misalnya dari
  // sesi "Tambah Lowongan" sebelumnya) alih-alih data asli job yang sedang diedit.
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "tenaga_pendukung",
        description: initialData.description || "",
        qualification: initialData.qualification || "",
        requirements: initialData.requirements || "",
        duration: initialData.duration || "",
        location: initialData.location || "",
        unit_kerja: initialData.unit_kerja || "",
        recruiter_name: initialData.recruiter_name || "",
        penyeleksi_ids: (initialData as any).penyeleksi_ids || [],
        start_date: formatForInputDate(initialData.start_date),
        end_date: formatForInputDate(initialData.end_date),
        kuota: (initialData as any).kuota ?? "", // 🚀 FIX FRONTEND: Ambil data kuota lama dari database agar muncul di input form edit
        form_fields: (initialData as any).form_fields || ["CV", "Ijazah"],
        selection_stages: ((initialData as any).selection_stages || []).map((stage: any) => ({
          id: String(stage.id),
          name: stage.name,
          description: stage.description || "",
          order: stage.order ?? stage.stage_order,
          stage_order: stage.order ?? stage.stage_order,
          start_date: formatForInputDate(stage.start_date),
          end_date: formatForInputDate(stage.end_date),
          grading_end_date: formatForInputDate(stage.grading_end_date),
          weight: stage.weight,
          test_link: stage.test_link || "",
          documents: (stage.documents || []).map((doc: any) => ({
            form_field_id: doc.form_field_id ?? doc.id,
            label: doc.label,
            weight: doc.weight ?? doc.pivot?.weight ?? 0,
          })),
        })),
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, initialData, mode]);

  const totalWeight = form.selection_stages.reduce((s, st) => s + (Number(st.weight) || 0), 0);
  
  const filteredPenyeleksi = availablePenyeleksi.filter((p) =>
    p.name.toLowerCase().includes(searchPenyeleksi.toLowerCase()),
  );
  const selectedPenyeleksi = availablePenyeleksi.filter((p) =>
    form.penyeleksi_ids.includes(p.id),
  );

  const togglePenyeleksi = (id: number) =>
    setForm((p) => ({
      ...p,
      penyeleksi_ids: p.penyeleksi_ids.includes(id)
        ? p.penyeleksi_ids.filter((pid) => pid !== id)
        : [...p.penyeleksi_ids, id],
    }));

  const updateStage = (id: string | number, key: keyof SelectionStage, value: any) => {
    setForm((p) => ({
      ...p,
      selection_stages: p.selection_stages.map((s) =>
        String(s.id) === String(id) ? { ...s, [key]: value } : s
      ),
    }));
  };

  const toggleStageDocument = (stageId: string | number, doc: { id: number; label: string }) => {
    setForm((p) => ({
      ...p,
      selection_stages: p.selection_stages.map((s) => {
        if (String(s.id) !== String(stageId)) return s;
        const documents = s.documents || [];
        const exists = documents.some((d) => d.form_field_id === doc.id);
        return {
          ...s,
          documents: exists
            ? documents.filter((d) => d.form_field_id !== doc.id)
            : [...documents, { form_field_id: doc.id, label: doc.label, weight: 0 }],
        };
      }),
    }));
  };

  const updateStageDocumentWeight = (stageId: string | number, formFieldId: number, weight: number) => {
    setForm((p) => ({
      ...p,
      selection_stages: p.selection_stages.map((s) =>
        String(s.id) === String(stageId)
          ? {
              ...s,
              documents: (s.documents || []).map((d) =>
                d.form_field_id === formFieldId ? { ...d, weight } : d
              ),
            }
          : s
      ),
    }));
  };

  const addStage = () => {
    setForm((p) => ({
      ...p,
      selection_stages: [
        ...p.selection_stages,
        {
          id: "s-" + Date.now(),
          name: "",
          description: "",
          order: p.selection_stages.length + 1,
          weight: 0,
          start_date: "",
          end_date: "",
          grading_end_date: "",
          test_link: null,
          documents: [],
        },
      ],
    }));
  };

  const removeStage = (id: string | number) =>
    setForm((p) => ({
      ...p,
      selection_stages: p.selection_stages
        .filter((s) => String(s.id) !== String(id))
        .map((s, i) => ({ ...s, order: i + 1 })),
    }));

  const moveStage = (id: string | number, dir: "up" | "down") =>
    setForm((p) => {
      const stages = [...p.selection_stages];
      const i = stages.findIndex((s) => String(s.id) === String(id));
      if (
        (dir === "up" && i === 0) ||
        (dir === "down" && i === stages.length - 1)
      )
        return p;
      [stages[i], stages[dir === "up" ? i - 1 : i + 1]] = [
        stages[dir === "up" ? i - 1 : i + 1],
        stages[i],
      ];
      return {
        ...p,
        selection_stages: stages.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });

  const validate = (): boolean => {
    const e: Partial<Record<keyof JobFormData, string>> = {};
    if (!form.title.trim()) e.title = "Judul wajib diisi";
    if (!form.description.trim()) e.description = "Deskripsi wajib diisi";
    if (!form.location.trim()) e.location = "Lokasi wajib diisi";
    if (!form.start_date) e.start_date = "Tanggal mulai wajib diisi";
    if (!form.end_date) e.end_date = "Tanggal selesai wajib diisi";
    if (!form.unit_kerja.trim()) e.unit_kerja = "Unit kerja wajib diisi";
    if (!form.duration.trim()) e.duration = "Durasi kontrak wajib diisi";
    if (!form.qualification.trim()) e.qualification = "Kualifikasi wajib diisi";
    if (!form.recruiter_name.trim()) e.recruiter_name = "Nama perekrut wajib diisi";
    if (form.kuota === "" || form.kuota === undefined || form.kuota === null || Number(form.kuota) <= 0)
      e.kuota = "Kuota wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    for (const stage of form.selection_stages) {
      const docs = stage.documents || [];
      if (docs.length > 0) {
        const docWeight = docs.reduce((s, d) => s + (Number(d.weight) || 0), 0);
        if (docWeight !== Number(stage.weight || 0)) {
          setErrorMsg(
            `Total bobot dokumen pada tahapan "${stage.name}" (${docWeight}%) harus sama dengan bobot tahapan (${stage.weight}%)`
          );
          return;
        }
      }

      if (stage.grading_end_date && stage.end_date && stage.grading_end_date < stage.end_date) {
        setErrorMsg(
          `Tanggal Berakhir Penilaian pada tahapan "${stage.name}" harus sama dengan atau setelah Tanggal Berakhir tahapan`
        );
        return;
      }
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // 🚀 BUNGKUS PAYLOAD BARU DAN CASTING KUOTA MENJADI INTEGER MURNI
      const payload = {
        ...form,
        kuota: form.kuota !== "" && form.kuota !== undefined && form.kuota !== null
          ? parseInt(form.kuota as string, 10)
          : null
      };

      // 🚀 PENTING: Kirim 'payload' ke onSubmit, BUKAN 'form' mentah!
      await onSubmit(payload as any); 
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (f: keyof JobFormData) =>
    `w-full px-3 py-2 rounded-lg border text-sm bg-gray-50 focus:bg-white outline-none transition-all ${errors[f] ? "border-red-200 focus:border-red-400" : "border-gray-200 focus:border-[#0D278D]"}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "add" ? "Tambah Lowongan" : "Edit Lowongan"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "add" ? "Buat lowongan baru" : "Perbarui data lowongan"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Kategori</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "tenaga_pendukung", label: "Tenaga Pendukung" },
                { value: "konsultan_individu", label: "Konsultan Individu" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: opt.value as any })}
                  className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all ${form.category === opt.value ? "border-[#0D278D] bg-blue-50 text-[#0D278D]" : "border-gray-100 text-gray-500 hover:border-gray-200"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Judul */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Lowongan</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Masukkan judul lowongan"
              className={inputClass("title")}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Lokasi + Unit Kerja */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Lokasi</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Kabupaten/Kota"
                className={inputClass("location")}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Unit Kerja</label>
              <input
                type="text"
                value={form.unit_kerja}
                onChange={(e) => setForm({ ...form, unit_kerja: e.target.value })}
                placeholder="Nama Balai/Satker"
                className={inputClass("unit_kerja")}
              />
              {errors.unit_kerja && <p className="text-red-500 text-xs mt-1">{errors.unit_kerja}</p>}
            </div>
          </div>

          {/* Perekrut + Durasi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Perekrut</label>
              <input
                type="text"
                value={form.recruiter_name}
                onChange={(e) => setForm({ ...form, recruiter_name: e.target.value })}
                placeholder="Nama perekrut"
                className={inputClass("recruiter_name")}
              />
              {errors.recruiter_name && <p className="text-red-500 text-xs mt-1">{errors.recruiter_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Durasi Kontrak</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="6 Bulan"
                className={inputClass("duration")}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>
          </div>

{/* Periode Lowongan Utama (tanggal + jam buka/tutup) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal &amp; Jam Buka</label>
              <input
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className={inputClass("start_date")}
              />
              <p className="text-[11px] text-gray-400 mt-1">Lowongan otomatis terbuka pada tanggal &amp; jam ini.</p>
              {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal &amp; Jam Tutup</label>
              <input
                type="datetime-local"
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className={inputClass("end_date")}
              />
              <p className="text-[11px] text-gray-400 mt-1">Batas akhir pendaftaran (deadline) mengikuti tanggal &amp; jam ini.</p>
              {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* 🚀 FORM INPUT KUOTA LOWONGAN (SINKRON KE DATABASE) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kuota Lowongan (Orang)</label>
            <input
              type="number"
              name="kuota"
              min="0"
              value={form.kuota ?? ""}
              onChange={(e) => setForm({ ...form, kuota: e.target.value })}
              placeholder="Contoh: 5"
              className={inputClass("kuota")}
            />
            {errors.kuota && <p className="text-red-500 text-xs mt-1">{errors.kuota}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder={"Deskripsi pekerjaan"}
              className={inputClass("description") + " resize-y"}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Kualifikasi + Persyaratan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kualifikasi</label>
              <textarea
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                rows={3}
                placeholder={"Pendidikan, jurusan"}
                className={inputClass("qualification") + " resize-y"}
              />
              {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Persyaratan</label>
              <textarea
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                rows={3}
                placeholder={"Skill, pengalaman"}
                className={inputClass("requirements") + " resize-y"}
              />
            </div>
          </div>

          {/* Tim Penyeleksi */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPenyeleksi(!showPenyeleksi)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Tim Penyeleksi</span>
                {selectedPenyeleksi.length > 0 && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {selectedPenyeleksi.length} dipilih
                  </span>
                )}
              </div>
              {showPenyeleksi ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {showPenyeleksi && (
              <div className="p-3 border-t border-gray-100 space-y-2">
                {selectedPenyeleksi.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPenyeleksi.map((p) => (
                      <span key={p.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0D278D] border border-blue-100">
                        {p.name}
                        <button type="button" onClick={() => togglePenyeleksi(p.id)} className="text-[#0D278D]/50 hover:text-red-500">
                          <XCircle size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchPenyeleksi}
                    onChange={(e) => setSearchPenyeleksi(e.target.value)}
                    placeholder="Cari penyeleksi..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#0D278D]"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
                  {filteredPenyeleksi.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePenyeleksi(p.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-all ${form.penyeleksi_ids.includes(p.id) ? "bg-blue-50 text-[#0D278D] font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${form.penyeleksi_ids.includes(p.id) ? "bg-[#0D278D] text-white" : "bg-gray-100 text-gray-500"}`}>
                        {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <span className="truncate">{p.name}</span>
                      {form.penyeleksi_ids.includes(p.id) && <CheckCircle2 size={14} className="text-[#0D278D] ml-auto shrink-0" />}
                    </button>
                  ))}
                  {filteredPenyeleksi.length === 0 && <p className="text-center text-xs text-gray-400 py-3">Tidak ditemukan</p>}
                </div>
              </div>
            )}
          </div>

          {/* Tahapan Seleksi */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowStages(!showStages)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Tahapan Seleksi</span>
                <span className="text-[11px] font-bold text-[#0D278D] bg-blue-50 px-2 py-0.5 rounded-full">{form.selection_stages.length} tahap</span>
                {form.selection_stages.length > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${totalWeight === 100 ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"}`}>
                    Bobot: {totalWeight}%
                  </span>
                )}
              </div>
              {showStages ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {showStages && (
              <div className="p-3 border-t border-gray-100 space-y-2">
                {[...form.selection_stages]
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((stage, index) => (
                    <div key={stage.id} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      {/* Order Controls */}
                      <div className="flex flex-col items-center gap-0.5 pt-1">
                        <button type="button" onClick={() => moveStage(stage.id, "up")} disabled={index === 0} className="text-gray-300 hover:text-[#0D278D] disabled:opacity-30 transition-colors">
                          <ChevronUp size={14} />
                        </button>
                        <span className="text-[11px] font-bold text-gray-500 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                          {stage.order}
                        </span>
                        <button type="button" onClick={() => moveStage(stage.id, "down")} disabled={index === form.selection_stages.length - 1} className="text-gray-300 hover:text-[#0D278D] disabled:opacity-30 transition-colors">
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Stage Fields */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nama Tahapan</label>
                          <input
                            type="text"
                            value={stage.name}
                            onChange={(e) => updateStage(stage.id, "name", e.target.value)}
                            placeholder="Contoh: Seleksi Administrasi"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-[#0D278D] font-semibold text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Deskripsi Singkat</label>
                          <input
                            type="text"
                            value={stage.description || ""}
                            onChange={(e) => updateStage(stage.id, "description", e.target.value)}
                            placeholder="Verifikasi dokumen dan persyaratan"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D] text-gray-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Bobot Penilaian (%)</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={stage.weight === 0 ? "" : stage.weight}
                                onChange={(e) =>
                                  updateStage(stage.id, "weight", e.target.value === "" ? 0 : Number(e.target.value))
                                }
                                min="0"
                                max="100"
                                placeholder="0"
                                className="w-full pl-3 pr-7 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">%</span>
                            </div>
                          </div>
                          {!isAdminStage(stage.name) && (
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Link Tes (opsional)</label>
                              <input
                                type="url"
                                value={stage.test_link || ""}
                                onChange={(e) => updateStage(stage.id, "test_link", e.target.value || null)}
                                placeholder="https://meet.google.com/..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D]"
                              />
                            </div>
                          )}
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tanggal &amp; Jam Mulai</label>
                            <input
                              type="datetime-local"
                              value={stage.start_date || ""}
                              onChange={(e) => updateStage(stage.id, "start_date", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D] text-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tanggal &amp; Jam Berakhir</label>
                            <input
                              type="datetime-local"
                              value={stage.end_date || ""}
                              min={stage.start_date || undefined}
                              onChange={(e) => updateStage(stage.id, "end_date", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D] text-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tanggal &amp; Jam Berakhir Penilaian</label>
                            <input
                              type="datetime-local"
                              value={stage.grading_end_date || ""}
                              min={stage.end_date || undefined}
                              onChange={(e) => updateStage(stage.id, "grading_end_date", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D] text-gray-600"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                              Batas akhir admin dan penyeleksi memberikan nilai untuk tahapan ini. Jika kosong, maka berakhir sesuai tanggal &amp; jam berakhir tahapan.
                            </p>
                          </div>
                        </div>

                        {isAdminStage(stage.name) && (
                          <div className="pt-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-[11px] font-semibold text-gray-500">
                                Dokumen yang Diperlukan &amp; Bobot Penilaian (%)
                              </label>
                              {(stage.documents || []).length > 0 && (
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    (stage.documents || []).reduce((s, d) => s + (Number(d.weight) || 0), 0) ===
                                    Number(stage.weight || 0)
                                      ? "text-green-600 bg-green-50"
                                      : "text-amber-600 bg-amber-50"
                                  }`}
                                >
                                  Bobot Dokumen: {(stage.documents || []).reduce((s, d) => s + (Number(d.weight) || 0), 0)}%
                                  {" "}/ {Number(stage.weight || 0)}%
                                </span>
                              )}
                            </div>
                            <div className="border border-gray-200 rounded-lg bg-white divide-y divide-gray-50">
                              {availableDocuments.length === 0 && (
                                <p className="text-center text-xs text-gray-400 py-3">Belum ada master dokumen</p>
                              )}
                              {availableDocuments.map((doc) => {
                                const selected = (stage.documents || []).find((d) => d.form_field_id === doc.id);
                                return (
                                  <div key={doc.id} className="flex items-center gap-2 px-3 py-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleStageDocument(stage.id, doc)}
                                      className={`flex items-center gap-2 flex-1 text-left text-xs font-semibold ${selected ? "text-[#0D278D]" : "text-gray-500"}`}
                                    >
                                      <span
                                        className={`w-4 h-4 rounded flex items-center justify-center border ${selected ? "bg-[#0D278D] border-[#0D278D]" : "border-gray-300"}`}
                                      >
                                        {selected && <CheckCircle2 size={12} className="text-white" />}
                                      </span>
                                      {doc.label}
                                    </button>
                                    {selected && (
                                      <div className="relative">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={selected.weight === 0 ? "" : selected.weight}
                                          onChange={(e) =>
                                            updateStageDocumentWeight(
                                              stage.id,
                                              doc.id,
                                              e.target.value === "" ? 0 : Number(e.target.value)
                                            )
                                          }
                                          placeholder="0"
                                          className="w-16 pl-2 pr-4 py-1 rounded-lg border border-gray-200 text-xs bg-gray-50 outline-none focus:border-[#0D278D] text-center"
                                        />
                                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">%</span>
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
                                      title="Hapus dokumen ini secara permanen"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="text"
                                value={newDocLabel}
                                onChange={(e) => setNewDocLabel(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddDocument(stage.id);
                                  }
                                }}
                                placeholder="Nama dokumen baru, contoh: SKCK"
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D]"
                              />
                              <button
                                type="button"
                                disabled={addingDoc || !newDocLabel.trim()}
                                onClick={() => handleAddDocument(stage.id)}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-[#0D278D] bg-blue-50 hover:bg-blue-100 border border-dashed border-blue-200 transition-all disabled:opacity-50"
                              >
                                <Plus size={12} /> Tambah
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete */}
                      <button type="button" onClick={() => removeStage(stage.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={addStage}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-[#0D278D] bg-blue-50 hover:bg-blue-100 border border-dashed border-blue-200 transition-all"
                >
                  <Plus size={14} className="inline mr-1" /> Tambah Tahapan
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{errorMsg}</div>}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all">
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : mode === "add" ? "Simpan" : "Perbarui"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;