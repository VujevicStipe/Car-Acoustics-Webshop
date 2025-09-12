import styles from "./page.module.css";
import HeroSection from "./containers/hero-section/HeroSection";
import CtaSection from "./containers/cta-section/CtaSection";
import FeaturedProductsSection from "./containers/featured-products-section/FeaturedProductsSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        <HeroSection />
        <CtaSection />
        <FeaturedProductsSection />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
