import React from "react";
import logoBbwsms from "../../assets/img/logobbwsms.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 p-1 rounded-md">
                <img
                  src={logoBbwsms}
                  alt="Logo BBWS"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#0D278D] text-sm leading-tight">
                  KEMENTERIAN PEKERJAAN UMUM
                </h4>
                <h4 className="font-bold text-[#0D278D] text-sm leading-tight">
                  DAN PERUMAHAN RAKYAT
                </h4>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Direktorat Jenderal Sumber Daya Air <br /> Balai Besar Wilayah
              Sungai Mesuji Sekampung
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 BBWS Kementerian PUPR. Direktorat Jenderal Sumber Daya Air.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <span className="hover:text-[#0D278D] cursor-pointer transition-colors">
              Kebijakan Privasi
            </span>
            <span className="hover:text-[#0D278D] cursor-pointer transition-colors">
              Syarat & Ketentuan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
