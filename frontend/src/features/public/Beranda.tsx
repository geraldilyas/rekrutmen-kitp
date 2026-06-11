import React, { useState, useEffect } from "react";
import BerandaUmum from "./BerandaUmum";
import BerandaLogin from "./BerandaLogin";

const Beranda: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    // 🔥 Cek apakah token login sudah ada di browser
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setCheckingAuth(false);
  }, []);

  // Spinner halus pas aplikasi lagi ngecek status login biar gak berkedip kasar
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D]" />
      </div>
    );
  }

  // 🚀 DIRECT OTOMATIS: Gak punya token? Ke sebelum login. Punya token? Ke sesudah login.
  return isLoggedIn ? <BerandaLogin /> : <BerandaUmum />;
};

export default Beranda;