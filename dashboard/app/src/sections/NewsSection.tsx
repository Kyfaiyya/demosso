import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const newsItems = [
  {
    timestamp: '4 menit yang lalu',
    title: 'Dapat Laporan Ancaman PHK Buruh, Dasco Telepon Dirut Pertamina',
    excerpt: 'Wakil Ketua DPR Sufmi Dasco Ahmad menelepon dengan Dirut Pertamina terkait ancaman PHK 55 ribu buruh akibat kenaikan harga gas industri.',
    link: '#',
  },
  {
    timestamp: '17 menit yang lalu',
    title: 'Jokowi Respons Kejaksaan Tak Tahan Roy Suryo dan Tifa',
    excerpt: 'Jokowi menghormati keputusan Kejaksaan Jaksel yang membebaskan Roy Suryo dan dokter Tifa terkait tudingan ijazah palsu.',
    link: '#',
  },
  {
    timestamp: '26 menit yang lalu',
    title: 'KPK Panggil Anggota DPR Nabil Husein di Kasus Rita Widyasari',
    excerpt: 'KPK memeriksa Nabil Husein, anggota DPR dari NasDem, sebagai saksi dalam kasus korupsi mantan Bupati Kutai Kartanegara.',
    link: '#',
  },
  {
    timestamp: '44 menit yang lalu',
    title: 'Tak Ajukan Praperadilan, Roy Suryo dan Tifa Siap Bertarung di Pengadilan',
    excerpt: 'Kuasa hukum Roy Suryo dan dokter Tifa tidak ajukan praperadilan terkait tuduhan ijazah palsu Jokowi.',
    link: '#',
  },
  {
    timestamp: '56 menit yang lalu',
    title: 'Andi Gani di Depan Dasco: 10 Hari ke Depan 55 Ribu Buruh Kena PHK',
    excerpt: 'Presiden KSPSI Andi Gani Nena Wea mengungkapkan 55 ribu buruh terancam PHK akibat kenaikan harga gas industri.',
    link: '#',
  },
  {
    timestamp: '1 jam yang lalu',
    title: 'Kapolri soal Roy Suryo dan Tifa Tak Ditahan: Kewenangan di Kejaksaan',
    excerpt: 'Kapolri Listyo Sigit Prabowo menjelaskan penangguhan penahanan Roy Suryo dan Tifauzia Tyassuma kini menjadi wewenang Kejaksaan.',
    link: '#',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function NewsSection() {
  const { ref, inView } = useScrollReveal(0.1);

  return (
    <section id="berita" className="bg-pg-dark-base py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-pg-accent mb-3">
              BERITA
            </p>
            <h2 className="text-3xl md:text-[40px] font-bold text-white leading-[1.2] tracking-[-0.01em] mb-2">
              Berita Nasional
            </h2>
            <p className="text-sm text-pg-text-tertiary">
              Sumber: CNN Indonesia
            </p>
          </div>

          {/* News Counter */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-pg-green flex items-center justify-center">
              <span className="text-lg font-semibold text-white">9</span>
            </div>
            <span className="text-xs font-medium text-white">Berita</span>
            <span className="text-xs text-pg-text-tertiary">Diperbarui secara berkala</span>
          </div>
        </motion.div>

        {/* News List */}
        <motion.div
          className="divide-y divide-white/[0.06]"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {newsItems.map((item, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="group py-6 flex flex-col md:flex-row md:items-start gap-3 md:gap-6 hover:bg-white/[0.02] transition-colors duration-200 -mx-4 px-4"
            >
              {/* Timestamp */}
              <time className="text-xs font-medium text-pg-text-tertiary min-w-[120px] pt-1">
                {item.timestamp}
              </time>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white leading-[1.4] mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-pg-text-secondary leading-[1.6] mb-3 line-clamp-2">
                  {item.excerpt}
                </p>
                <a
                  href={item.link}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-pg-green-light hover:underline transition-all"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-pg-text-tertiary mt-8"
        >
          Data berita bersumber dari CNN Indonesia melalui API publik
        </motion.p>
      </div>
    </section>
  );
}
