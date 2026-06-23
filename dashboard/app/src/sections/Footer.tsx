import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const layananLinks = [
  'Administrasi Kependudukan',
  'Perizinan & Non-Perizinan',
  'Pajak & Retribusi',
  'Layanan Kesehatan',
  'Semua Layanan',
];

const menuLinks = [
  'Tentang Kami',
  'Berita',
  'Produk & Layanan',
  'Kontak',
];

const footerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function Footer() {
  const { ref, inView } = useScrollReveal(0.1);

  return (
    <footer id="kontak" className="bg-pg-green-dark pt-16 pb-8">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12" ref={ref}>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8"
          variants={footerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Column 1 - Brand */}
          <motion.div variants={columnVariants} className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-pg-accent" />
              <span className="text-xs font-medium tracking-[0.1em] text-white uppercase">
                MPP DIGITAL
              </span>
            </div>
            <p className="text-sm text-pg-text-secondary leading-[1.6] max-w-[320px]">
              Aplikasi Layanan Terpadu dari Pemerintah Kabupaten Penajam Paser Utara
              memudahkan Anda dalam mengakses berbagai layanan publik secara digital.
            </p>
          </motion.div>

          {/* Column 2 - Layanan Publik */}
          <motion.div variants={columnVariants} className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-5">Layanan Publik</h4>
            <ul className="space-y-3">
              {layananLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-pg-text-secondary hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Menu */}
          <motion.div variants={columnVariants} className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-5">Menu</h4>
            <ul className="space-y-3">
              {menuLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-pg-text-secondary hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Hubungi Kami */}
          <motion.div variants={columnVariants} className="lg:col-span-4">
            <h4 className="text-lg font-semibold text-white mb-5">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pg-text-tertiary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-pg-text-secondary">
                  Jl. Provinsi KM 9 Nipah Nipah, Kalimantan Timur
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pg-text-tertiary flex-shrink-0" />
                <span className="text-sm text-pg-text-secondary">(0542) 000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-pg-text-tertiary flex-shrink-0" />
                <span className="text-sm text-pg-text-secondary">info@penajamkab.go.id</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-pg-text-tertiary text-center md:text-left">
            &copy; 2026 Dinas Komunikasi dan Informatika Kabupaten Penajam Paser Utara. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-pg-text-tertiary hover:text-pg-text-secondary transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-xs text-pg-text-tertiary hover:text-pg-text-secondary transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
