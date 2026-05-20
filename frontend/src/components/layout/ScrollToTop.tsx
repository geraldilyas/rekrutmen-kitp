import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Memaksa browser kembali ke posisi koordinat paling atas (X: 0, Y: 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Akan berjalan otomatis setiap kali jalur rute (path) berubah

  return null; // Komponen ini hanya menjalankan logic, tidak me-render elemen visual
};

export default ScrollToTop;