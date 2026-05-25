import { useState, useCallback, useEffect } from "react";
import { api } from "../../services/api";

export function useProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengambil profil");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const res = await api.put("/auth/update-profile", data);
      setUser(res.data.user);
      // Update local storage if needed
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError(null);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal memperbarui profil";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const res = await api.put("/auth/change-password", data);
      setError(null);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal mengubah kata sandi";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, error, updateProfile, changePassword, refresh: fetchProfile };
}

export function useUserDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/user-documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Gagal mengambil dokumen", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = async (type: string, file: File) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);
    const res = await api.post("/user-documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchDocuments();
    return res.data;
  };

  const deleteDocument = async (id: number) => {
    await api.delete(`/user-documents/${id}`);
    fetchDocuments();
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, uploadDocument, deleteDocument, refresh: fetchDocuments };
}
