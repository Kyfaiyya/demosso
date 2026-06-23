import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ScrollText, ArrowRight } from 'lucide-react';
import { useSlider } from '../hooks/useSlider';

const slides = [
  { id: 0, image: '/hero-bg.jpg' },
  { id: 1, image: '/hero-bg.jpg' },
  { id: 2, image: '/hero-bg.jpg' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const portraitVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: 0.6, ease: 'easeOut' as const },
  },
};

export default function HeroSection() {
  const { currentSlide, goToSlide, goNext, goPrev, setHovered } = useSlider({
    totalSlides: slides.length,
    autoAdvanceInterval: 6000,
  });

  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden flex items-end pb-16 md:pb-24 pt-[72px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Slider */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10,15,13,0.3) 0%, rgba(10,15,13,0.7) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background: 'linear-gradient(0deg, rgba(10,15,13,0.95) 0%, rgba(10,15,13,0) 100%)',
        }}
      />
      {/* Additional dark overlay for readability */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 15, 13, 0.45)' }} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-end gap-8 lg:gap-4">
          {/* Left Column - Text */}
          <motion.div
            className="flex-1 lg:max-w-[55%]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-[0.15em] uppercase bg-pg-green text-pg-accent">
                PPU Layanan Terintegrasi
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-4"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              Mall Pelayanan Publik Digital (MPPD)
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-pg-text-secondary leading-[1.7] max-w-[540px] mb-8"
            >
              Aplikasi Layanan Terpadu dari Pemerintah Kabupaten Penajam Paser Utara
              memudahkan Anda dalam mengakses berbagai layanan publik.
              <br />
              Pelayanan pemerintah kini hadir langsung di genggaman tangan Anda — cepat, mudah, dan transparan.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-pg-green text-white font-semibold rounded-lg hover:bg-pg-green-light transition-colors duration-200"
              >
                <ScrollText className="w-4 h-4" />
                Dasar Hukum
              </a>
              <a
                href="#layanan"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Jelajahi Layanan
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Portraits */}
          <motion.div
            className="hidden lg:flex items-end gap-0 flex-shrink-0"
            variants={portraitVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Portrait 1 - Bupati */}
            <div className="relative flex flex-col items-center -mr-4">
              <img
                src="/pejabat-1.png"
                alt="H. Mudyat Noor, S.Hut - Bupati Penajam Paser Utara"
                className="w-[180px] h-auto object-contain"
                loading="eager"
              />
              <div
                className="w-full px-3 py-3 text-center"
                style={{
                  background: 'linear-gradient(90deg, #1B4332 0%, #2D6A4F 100%)',
                  borderRadius: '0 0 8px 8px',
                }}
              >
                <p className="text-sm font-semibold text-white">H. MUDYAT NOOR, S.Hut</p>
                <p className="text-xs text-pg-text-secondary mt-0.5">Bupati Penajam Paser Utara</p>
              </div>
            </div>

            {/* Portrait 2 - Wakil Bupati */}
            <div className="relative flex flex-col items-center">
              <img
                src="/pejabat-2.png"
                alt="Abdul Waris Muin - Wakil Bupati Penajam Paser Utara"
                className="w-[180px] h-auto object-contain"
                loading="eager"
              />
              <div
                className="w-full px-3 py-3 text-center"
                style={{
                  background: 'linear-gradient(90deg, #1B4332 0%, #2D6A4F 100%)',
                  borderRadius: '0 0 8px 8px',
                }}
              >
                <p className="text-sm font-semibold text-white">ABDUL WARIS MUIN</p>
                <p className="text-xs text-pg-text-secondary mt-0.5">Wakil Bupati Penajam Paser Utara</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slider Arrows */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={goPrev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={goNext}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Slider Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === currentSlide ? '#D4A017' : 'rgba(255,255,255,0.3)',
              transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </section>
  );
}
