import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-[#FEB700] p-1 rounded-md">
                 <img src="/logo-pupr.png" alt="PUPR" className="w-full h-full object-contain" />
               </div>
               <div>
                 <h4 className="font-bold text-[#0D278D] text-sm leading-tight">KEMENTERIAN PEKERJAAN UMUM</h4>
                 <h4 className="font-bold text-[#0D278D] text-sm leading-tight">DAN PERUMAHAN RAKYAT</h4>
               </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Direktorat Jenderal Sumber Daya Air <br /> Balai Besar Wilayah Sungai Mesuji Sekampung
            </p>
          </div>

          {/* Tautan Penting */}
          <div>
            <h5 className="font-bold text-[#0D278D] mb-4">Tautan Penting</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-[#FEB700] cursor-pointer">Profil Balai</li>
              <li className="hover:text-[#FEB700] cursor-pointer">Peta Wilayah Sungai</li>
              <li className="hover:text-[#FEB700] cursor-pointer">Berita Terkini</li>
              <li className="hover:text-[#FEB700] cursor-pointer">E-Procurement</li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h5 className="font-bold text-[#0D278D] mb-4">Bantuan & Kontak</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-[#FEB700] cursor-pointer">Panduan Aplikasi</li>
              <li className="hover:text-[#FEB700] cursor-pointer">Hubungi Panitia</li>
              <li className="hover:text-[#FEB700] cursor-pointer">Lokasi Tes</li>
              <li className="hover:text-[#FEB700] cursor-pointer">FAQ</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 BBWS Kementerian PUPR. Direktorat Jenderal Sumber Daya Air.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <span className="hover:text-[#0D278D] cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-[#0D278D] cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;