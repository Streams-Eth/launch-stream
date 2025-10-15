import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { TokenSalesShowcase } from "@/components/token-sales-showcase"
import { TopProjectsSection } from "@/components/top-projects-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <HeroSection />
      <ServicesSection />
      <TokenSalesShowcase />
      <TopProjectsSection />
      <Footer />
    </main>
  )
}
