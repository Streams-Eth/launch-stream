import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-slate-400 mb-8">Sorry, the page you are looking for does not exist.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">Go Home</a>
      </div>
      <Footer />
    </main>
  )
}
