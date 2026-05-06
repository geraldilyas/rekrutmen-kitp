import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: any) => {
  e.preventDefault();
  setErrorMsg([]);

  try {
    await api.post("/register", form);
    navigate("/login");
  } catch (error: any) {
    console.log("FULL ERROR:", error.response);

    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const list: string[] = [];

      Object.keys(errors).forEach((key) => {
        list.push(errors[key][0]);
      });

      setErrorMsg(list);
    }

    else if (error.response?.data?.message) {
      setErrorMsg([error.response.data.message]);
    }

    else {
      setErrorMsg(["Terjadi kesalahan server. Coba lagi nanti."]);
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#0D278D] mb-6 text-center">
          Daftar Akun
        </h2>

        {/* Pesan Error */}
        {errorMsg.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-600 font-semibold text-sm mb-1">Registrasi gagal:</p>
            <ul className="list-disc list-inside">
              {errorMsg.map((msg, i) => (
                <li key={i} className="text-red-500 text-sm">{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0D278D] text-white p-3 rounded-lg font-semibold hover:opacity-90"
        >
          Daftar
        </button>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#0D278D] font-semibold cursor-pointer"
          >
            Masuk
          </span>
        </p>
      </form>
    </div>
  );
}