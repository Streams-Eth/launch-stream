"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/hooks/use-web3"
import { toast } from "sonner"

const topProjects = [
  {
    name: "UniSwap V4",
    category: "DEX",
    description: "The most advanced decentralized exchange with concentrated liquidity and hooks",
    tvl: "$4.2B",
    apy: "12.5%",
    rating: 4.9,
    logo: "/uniswap-pink-unicorn-logo.jpg",
    featured: true,
  },
  {
    name: "Compound Finance",
    category: "Lending",
    description: "Algorithmic money markets protocol for lending and borrowing crypto assets",
    tvl: "$2.8B",
    apy: "8.3%",
    rating: 4.7,
    logo: "/compound-green-finance-logo.jpg",
    featured: true,
  },
  {
    name: "Aave Protocol",
    category: "Lending",
    description: "Open source and non-custodial liquidity protocol for earning interest",
    tvl: "$6.1B",
    apy: "9.7%",
    rating: 4.8,
    logo: "/aave-ghost-purple-logo.jpg",
    featured: true,
  },
  {
    name: "Curve Finance",
    category: "DEX",
    description: "Decentralized exchange optimized for stablecoin and similar asset trading",
    tvl: "$3.5B",
    apy: "15.2%",
    rating: 4.6,
    logo: "/curve-blue-finance-logo.jpg",
    featured: false,
  },
  {
    name: "Yearn Finance",
    category: "Yield",
    description: "Yield farming protocol that automatically moves funds between DeFi protocols",
    tvl: "$1.9B",
    apy: "11.8%",
    rating: 4.5,
    logo: "/yearn-blue-vault-logo.jpg",
    featured: false,
  },
  {
    name: "SushiSwap",
    category: "DEX",
    description: "Community-driven decentralized exchange with additional DeFi features",
    tvl: "$1.2B",
    apy: "13.4%",
    rating: 4.4,
    logo: "/sushi-orange-fish-logo.jpg",
    featured: false,
  },
]

export function TopProjectsSection() {
  const router = useRouter()
  const { isConnected, connectWallet } = useWeb3()

  const handleInvest = async (projectName: string) => {
    if (!isConnected) {
      try {
        await connectWallet()
        toast.success("Wallet connected! You can now invest.")
      } catch (error) {
        toast.error("Please connect your wallet to invest")
        return
      }
    }

    toast.success(`Redirecting to ${projectName} investment page...`)
    router.push("/dashboard")
  }

  const handleExplore = (projectName: string) => {
    toast.info(`Opening ${projectName} external page...`)
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 text-balance">Top DeFi Projects</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Discover the most successful projects launched through Launch Stream
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProjects.map((project, index) => (
            <Card
              key={index}
              className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                project.featured ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.logo || "/placeholder.svg"}
                      alt={project.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  {project.featured && <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>}
                </div>
                <CardDescription className="text-sm">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">TVL</p>
                    <p className="text-lg font-semibold">{project.tvl}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">APY</p>
                    <p className="text-lg font-semibold text-green-600">{project.apy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(project.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({project.rating})</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleInvest(project.name)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Invest
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleExplore(project.name)}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
            onClick={() => router.push("/dashboard")}
          >
            Explore All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
