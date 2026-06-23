import { motion } from 'framer-motion';
import { CloudSun, IdCard, Shield, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const smartServices = [
  {
    icon: CloudSun,
    title: 'Layanan Dukcapil',
    description: 'Data Kependudukan & Pencatatan Sipil',
    link: 'http://localhost:3000',
  },
  {
    icon: IdCard,
    title: 'Layanan Kominfo',
    description: 'Registrasi SIM Card & Domain',
    link: 'http://localhost:3001',
  },
  {
    icon: Shield,
    title: 'Layanan Pendidikan',
    description: 'Data Siswa & Nilai Akademik',
    link: 'http://localhost:3002',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function SmartServiceSection() {
  const { ref, inView } = useScrollReveal(0.15);

  return (
    <section className="bg-pg-light py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-pg-green mb-3">
            SMART SERVICE
          </p>
          <h2 className="text-2xl md:text-[32px] font-semibold text-pg-text-on-light leading-[1.25] tracking-[-0.01em]">
            Jelajahi aplikasi dan pelayanan di Penajam Paser Utara
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {smartServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.a
                key={index}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                className="group block p-8 bg-white rounded-xl border border-pg-border-light shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-pg-green/30"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-pg-light">
                  <IconComponent className="w-7 h-7 text-pg-green" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-pg-text-on-light leading-[1.3] mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-base text-pg-text-on-light-secondary leading-[1.7] mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-pg-green hover:text-pg-green-light transition-colors">
                  Akses Layanan
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
