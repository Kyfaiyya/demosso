import { motion } from 'framer-motion';
import {
  Video, Users, FileCheck, Calculator, Briefcase,
  HeartPulse, GraduationCap, School, Leaf, UserCog,
  Monitor, Bus, Megaphone, Database, Hospital, ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const services = [
  { icon: Video, label: 'CCTV' },
  { icon: Users, label: 'Administrasi Kependudukan' },
  { icon: FileCheck, label: 'Perizinan & Non-Perizinan' },
  { icon: Calculator, label: 'Pajak & Retribusi' },
  { icon: Briefcase, label: 'Ketenagakerjaan' },
  { icon: HeartPulse, label: 'Kesehatan & Jaminan Sosial' },
  { icon: GraduationCap, label: 'Pendidikan' },
  { icon: School, label: 'Pendaftaran Sekolah' },
  { icon: Leaf, label: 'Lingkungan Hidup' },
  { icon: UserCog, label: 'Kepegawaian' },
  { icon: Monitor, label: 'Monitoring & Infrastruktur Digital' },
  { icon: Bus, label: 'Transportasi' },
  { icon: Megaphone, label: 'Pengaduan & Partisipasi Publik' },
  { icon: Database, label: 'Portal Satu Data' },
  { icon: Hospital, label: 'Pendaftaran Online RSUD' },
  { icon: ShieldCheck, label: 'Pendaftaran SKCK' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function ServicesSection() {
  const { ref, inView } = useScrollReveal(0.1);

  return (
    <section id="layanan" className="bg-pg-green-dark py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-pg-accent mb-3">
            LAYANAN
          </p>
          <h2 className="text-3xl md:text-[40px] font-bold text-white leading-[1.2] tracking-[-0.01em] mb-4">
            Publik Terintegrasi
          </h2>
          <p className="text-base text-pg-text-secondary leading-[1.7]">
            Akses berbagai layanan publik dalam satu platform terpadu.
          </p>
        </motion.div>

        {/* Service Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.a
                key={index}
                href="#"
                variants={cardVariants}
                className="group block p-5 md:p-6 rounded-xl border border-white/[0.06] transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#111814', minHeight: '140px' }}
                whileHover={{
                  backgroundColor: '#1A231F',
                  borderColor: 'rgba(45, 106, 79, 0.4)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-opacity-40"
                  style={{ backgroundColor: 'rgba(45, 106, 79, 0.2)' }}
                >
                  <IconComponent className="w-6 h-6 text-pg-green-light" />
                </div>
                {/* Label */}
                <h3 className="text-base font-semibold text-white leading-[1.4] line-clamp-2">
                  {service.label}
                </h3>
              </motion.a>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-pg-green-light text-white font-semibold rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Semua Layanan
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
