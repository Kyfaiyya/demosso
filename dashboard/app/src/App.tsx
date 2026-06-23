import Header from './sections/Header';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import SmartServiceSection from './sections/SmartServiceSection';
import NewsSection from './sections/NewsSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-pg-dark-base">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <SmartServiceSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
