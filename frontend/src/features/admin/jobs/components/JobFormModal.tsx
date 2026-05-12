import React, { useEffect } from "react";
import { X, Plus, Minus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { Job, JobFormData, SelectionStage } from "../../types";

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  initialData?: Job | null;
  mode: "add" | "edit";
}

const initialState: JobFormData = {
  title: "",
  category: "tenaga_pendukung",
  type: "",
  description: "",
  qualification: "",
  requirements: "",
  duration: "",
  location: "",
  unit_kerja: "",
  recruiter_name: "",
  start_date: "",
  end_date: "",
  deadline: "",
  form_fields: ["CV", "Ijazah"],
  selection_stages: [
    {
      id: "stage-" + Date.now(),
      name: "Seleksi Administrasi",
      description: "Verifikasi dokumen dan persyaratan",
      order: 1,
    },
  ],
};

const fieldOptions = [
  "CV",
  "Ijazah",
  "Transkrip Nilai",
  "Sertifikat Pendukung",
  "Portfolio",
  "SKCK",
  "KTP",
  "Surat Lamaran",
  "Pas Foto",
];

const defaultStageNames = [
  "Seleksi Administrasi",
  "Tes Kompetensi",
  "Tes Praktik",
  "Wawancara Teknis",
  "Wawancara HR",
  "Presentasi",
  "Medical Check Up",
  "Orientasi",
];

const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [form, setForm] = React.useState<JobFormData>(initialState);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof JobFormData, string>>
  >({});
  const [newStageName, setNewStageName] = React.useState("");
  const [newStageDesc, setNewStageDesc] = React.useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === "edit") {
        setForm({
          title: initialData.title,
          category: initialData.category,
          type: initialData.type || "",
          description: initialData.description || "",
          qualification: initialData.qualification || "",
          requirements: initialData.requirements || "",
          duration: initialData.duration || "",
          location: initialData.location || "",
          unit_kerja: initialData.unit_kerja || "",
          recruiter_name: initialData.recruiter_name || "",
          start_date: initialData.start_date || "",
          end_date: initialData.end_date || "",
          deadline: initialData.deadline || "",
          form_fields: initialData.form_fields || ["CV", "Ijazah"],
          selection_stages: initialData.selection_stages || [],
        });
      } else {
        setForm({
          ...initialState,
          selection_stages: [
            {
              id: "stage-" + Date.now(),
              name: "Seleksi Administrasi",
              description: "Verifikasi dokumen dan persyaratan",
              order: 1,
            },
          ],
        });
      }
      setErrors({});
      setNewStageName("");
      setNewStageDesc("");
    }
  }, [isOpen, initialData, mode]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "Wajib diisi";
    if (!form.description.trim()) newErrors.description = "Wajib diisi";
    if (!form.location.trim()) newErrors.location = "Wajib diisi";
    if (!form.start_date) newErrors.start_date = "Wajib diisi";
    if (!form.end_date) newErrors.end_date = "Wajib diisi";
    if (form.form_fields.length === 0)
      newErrors.form_fields = "Minimal satu dokumen";
    if (form.selection_stages.length === 0)
      newErrors.selection_stages = "Minimal satu tahapan";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  const toggleField = (field: string) => {
    setForm((prev) => ({
      ...prev,
      form_fields: prev.form_fields.includes(field)
        ? prev.form_fields.filter((f) => f !== field)
        : [...prev.form_fields, field],
    }));
  };

  // Selection Stages handlers
  const addStage = () => {
    const name = newStageName.trim();
    if (!name) return;

    const newStage: SelectionStage = {
      id: "stage-" + Date.now(),
      name,
      description: newStageDesc.trim(),
      order: form.selection_stages.length + 1,
    };

    setForm((prev) => ({
      ...prev,
      selection_stages: [...prev.selection_stages, newStage],
    }));
    setNewStageName("");
    setNewStageDesc("");
  };

  const removeStage = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selection_stages: prev.selection_stages
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 })),
    }));
  };

  const moveStage = (id: string, direction: "up" | "down") => {
    setForm((prev) => {
      const stages = [...prev.selection_stages];
      const index = stages.findIndex((s) => s.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === stages.length - 1)
      )
        return prev;

      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [stages[index], stages[swapIndex]] = [stages[swapIndex], stages[index]];

      return {
        ...prev,
        selection_stages: stages.map((s, i) => ({ ...s, order: i + 1 })),
      };
    });
  };

  const updateStageName = (id: string, name: string) => {
    setForm((prev) => ({
      ...prev,
      selection_stages: prev.selection_stages.map((s) =>
        s.id === id ? { ...s, name } : s,
      ),
    }));
  };

  const updateStageDesc = (id: string, description: string) => {
    setForm((prev) => ({
      ...prev,
      selection_stages: prev.selection_stages.map((s) =>
        s.id === id ? { ...s, description } : s,
      ),
    }));
  };

  const quickAddStage = (stageName: string) => {
    const newStage: SelectionStage = {
      id: "stage-" + Date.now(),
      name: stageName,
      description: "",
      order: form.selection_stages.length + 1,
    };
    setForm((prev) => ({
      ...prev,
      selection_stages: [...prev.selection_stages, newStage],
    }));
  };

  const inputClass = (field: keyof JobFormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all outline-none ${
      errors[field]
        ? "border-red-200 focus:border-red-400"
        : "border-gray-100 focus:border-[#0D278D]"
    }`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-50 rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "add" ? "Tambah Lowongan" : "Edit Lowongan"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {mode === "add"
                ? "Lengkapi form untuk membuat lowongan baru"
                : "Perbarui data lowongan"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0D278D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0D278D] rounded-full" />
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "tenaga_pendukung", label: "Tenaga Pendukung" },
                    {
                      value: "konsultan_individu",
                      label: "Konsultan Individu",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          category: opt.value as JobFormData["category"],
                        })
                      }
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                        form.category === opt.value
                          ? "border-[#0D278D] bg-blue-50 text-[#0D278D]"
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Jenis
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputClass("type")}
                >
                  <option value="">Pilih jenis</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Proyek">Proyek</option>
                  <option value="Tetap">Tetap</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Judul Lowongan
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Tenaga Pendamping Masyarakat"
                className={inputClass("title")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Kabupaten/Kota"
                  className={inputClass("location")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Unit Kerja
                </label>
                <input
                  type="text"
                  value={form.unit_kerja}
                  onChange={(e) =>
                    setForm({ ...form, unit_kerja: e.target.value })
                  }
                  placeholder="Balai/Satker"
                  className={inputClass("unit_kerja")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Perekrut
                </label>
                <input
                  type="text"
                  value={form.recruiter_name}
                  onChange={(e) =>
                    setForm({ ...form, recruiter_name: e.target.value })
                  }
                  placeholder="Nama perekrut"
                  className={inputClass("recruiter_name")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Durasi
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="6 Bulan"
                  className={inputClass("duration")}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Deskripsi & Persyaratan */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0D278D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0D278D] rounded-full" />
              Deskripsi & Persyaratan
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Deskripsi
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                placeholder="Deskripsi singkat lowongan"
                className={inputClass("description") + " resize-none"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Kualifikasi
              </label>
              <textarea
                value={form.qualification}
                onChange={(e) =>
                  setForm({ ...form, qualification: e.target.value })
                }
                rows={2}
                placeholder="Pendidikan, jurusan, dll."
                className={inputClass("qualification") + " resize-none"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Persyaratan
              </label>
              <textarea
                value={form.requirements}
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
                rows={2}
                placeholder="Skill, pengalaman, dokumen khusus"
                className={inputClass("requirements") + " resize-none"}
              />
            </div>
          </div>

          {/* Section 3: Periode */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0D278D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0D278D] rounded-full" />
              Periode
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Mulai
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                  className={inputClass("start_date")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Selesai
                </label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                  className={inputClass("end_date")}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className={inputClass("deadline")}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Tahapan Seleksi */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0D278D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0D278D] rounded-full" />
              Tahapan Seleksi
            </h3>

            {/* Quick Add Buttons */}
            <div className="flex flex-wrap gap-2">
              {defaultStageNames
                .filter(
                  (name) => !form.selection_stages.some((s) => s.name === name),
                )
                .slice(0, 6)
                .map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => quickAddStage(name)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 hover:border-[#0D278D]/30 hover:text-[#0D278D] transition-all"
                  >
                    <Plus size={10} className="inline mr-1" />
                    {name}
                  </button>
                ))}
            </div>

            {/* Stage List */}
            <div className="space-y-2">
              {form.selection_stages
                .sort((a, b) => a.order - b.order)
                .map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-all"
                  >
                    <div className="flex flex-col items-center gap-0.5 pt-1">
                      <button
                        type="button"
                        onClick={() => moveStage(stage.id, "up")}
                        disabled={index === 0}
                        className="text-gray-300 hover:text-[#0D278D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-bold text-gray-400 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        {stage.order}
                      </span>
                      <button
                        type="button"
                        onClick={() => moveStage(stage.id, "down")}
                        disabled={index === form.selection_stages.length - 1}
                        className="text-gray-300 hover:text-[#0D278D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) =>
                          updateStageName(stage.id, e.target.value)
                        }
                        placeholder="Nama tahapan"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0D278D] transition-all font-semibold text-gray-700"
                      />
                      <input
                        type="text"
                        value={stage.description}
                        onChange={(e) =>
                          updateStageDesc(stage.id, e.target.value)
                        }
                        placeholder="Deskripsi singkat (opsional)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0D278D] transition-all text-gray-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeStage(stage.id)}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all mt-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
            </div>

            {/* Custom Add Stage */}
            <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="Nama tahapan baru"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0D278D] transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addStage();
                    }
                  }}
                />
                <input
                  type="text"
                  value={newStageDesc}
                  onChange={(e) => setNewStageDesc(e.target.value)}
                  placeholder="Deskripsi (opsional)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0D278D] transition-all"
                />
              </div>
              <button
                type="button"
                onClick={addStage}
                disabled={!newStageName.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Section 5: Dokumen Pendaftaran */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0D278D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0D278D] rounded-full" />
              Dokumen Pendaftaran
            </h3>

            <div className="flex flex-wrap gap-2">
              {fieldOptions.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => toggleField(field)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border-2 ${
                    form.form_fields.includes(field)
                      ? "bg-[#0D278D] text-white border-[#0D278D]"
                      : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {form.form_fields.includes(field) ? (
                    <Minus size={10} className="inline mr-1" />
                  ) : (
                    <Plus size={10} className="inline mr-1" />
                  )}
                  {field}
                </button>
              ))}
            </div>
            {form.form_fields.length > 0 && (
              <p className="text-xs text-gray-400">
                {form.form_fields.length} dokumen dipilih
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all"
            >
              {mode === "add" ? "Simpan" : "Perbarui"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
