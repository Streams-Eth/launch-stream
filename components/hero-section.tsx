import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Rocket className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-balance mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Create Tokens for Just 0.00655 ETH
        </h1>

        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
          The most affordable token launch pad on the internet. Deploy ERC20 tokens, create presales, and manage your
          project all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/streamsmint">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Launch Your Token
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            Explore Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
