import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Pantau posisi scroll monitor pelamar
  useEffect(() => {
    const toggleVisibility = () => {
      // Tombol baru muncul jika user scroll ke bawah lebih dari 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Handler Smooth Scroll ke Atas Monitor
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Efek seluncuran halus
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          /* 🚀 FIX EMAS: Pindahkan warna kuning (#FEB700) ke dalam whileHover milik Framer Motion 
             dan ganti text color-nya jadi biru tua biar kontrasnya tajam & mewah */
          whileHover={{ y: -5, backgroundColor: "#FEB700", color: "#0D278D", borderColor: "#FEB700" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          /* 🚀 RESPONSIVE FIX: 
             - Di HP (default): Jarak bottom-5 right-5, ukuran w-10 h-10, rounded-xl biar pas.
             - Di Desktop (md:): Jarak balik ke bottom-8 right-8, ukuran kembali w-12 h-12, rounded-2xl.
          */
          className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[9999] w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#0D278D] backdrop-blur-md border border-[#0D278D] text-white shadow-[0_15px_30px_-10px_rgba(13,39,141,0.3)] flex items-center justify-center cursor-pointer transition-colors duration-200"
          aria-label="Scroll to top"
        >
          {/* 🚀 RESPONSIVE ICON: Ukuran icon menyesuaikan (size 18 di HP, size 22 di desktop) */}
          <ChevronUp className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;