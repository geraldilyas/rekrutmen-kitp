import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/beranda");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Email atau password salah.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#0D278D] mb-6 text-center">
          Masuk
        </h2>

        {/* Pesan Error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-500 text-sm">{errorMsg}</p>
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0D278D] text-white p-3 rounded-lg font-semibold hover:opacity-90"
        >
          Masuk
        </button>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#0D278D] font-semibold cursor-pointer"
          >
            Daftar
          </span>
        </p>
      </form>
    </div>
  );
}
