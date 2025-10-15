import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Users } from "lucide-react"

const tokenSales = [
  {
    name: "DeFiMax Protocol",
    symbol: "DMAX",
    description: "Next-generation yield farming protocol with automated strategies",
    raised: 850000,
    target: 1000000,
    participants: 2847,
    timeLeft: "2 days",
    status: "live",
    logo: "/defi-protocol-logo-blue.jpg",
  },
  {
    name: "GameFi Arena",
    symbol: "GFA",
    description: "Play-to-earn gaming ecosystem with NFT integration",
    raised: 1200000,
    target: 1500000,
    participants: 4521,
    timeLeft: "5 days",
    status: "live",
    logo: "/gaming-token-logo-purple.jpg",
  },
  {
    name: "EcoChain",
    symbol: "ECO",
    description: "Carbon-neutral blockchain for sustainable DeFi applications",
    raised: 750000,
    target: 800000,
    participants: 1923,
    timeLeft: "1 day",
    status: "ending",
    logo: "/green-eco-blockchain-logo.jpg",
  },
  {
    name: "MetaVault",
    symbol: "MVT",
    description: "Cross-chain asset management and yield optimization platform",
    raised: 2000000,
    target: 2000000,
    participants: 6789,
    timeLeft: "Ended",
    status: "completed",
    logo: "/vault-security-logo-gold.jpg",
  },
]

const trendingProjects = [
  {
    name: "AquaSwap",
    symbol: "AQUA",
    change: "+245%",
    volume: "$2.4M",
    logo: "/water-blue-swap-logo.jpg",
  },
  {
    name: "RocketFuel",
    symbol: "FUEL",
    change: "+189%",
    volume: "$1.8M",
    logo: "/rocket-fuel-orange-logo.jpg",
  },
  {
    name: "CryptoVault",
    symbol: "CVT",
    change: "+156%",
    volume: "$3.2M",
    logo: "/crypto-vault-purple-logo.jpg",
  },
  {
    name: "FlashLoan",
    symbol: "FLASH",
    change: "+134%",
    volume: "$1.5M",
    logo: "/lightning-flash-yellow-logo.jpg",
  },
]

export function TokenSalesShowcase() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Latest Sales Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 text-balance text-white">Follow Our Latest Sales</h2>
          <p className="text-xl text-white/90 text-pretty max-w-2xl mx-auto">
            Discover and participate in the most promising token launches and presales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {tokenSales.map((sale, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={sale.logo || "/placeholder.svg"} alt={sale.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <CardTitle className="text-lg">{sale.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{sale.symbol}</p>
                  </div>
                </div>
                <Badge
                  className={`w-fit ${
                    sale.status === "live"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : sale.status === "ending"
                        ? "bg-orange-100 text-orange-800 border-orange-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {sale.status === "live" ? "Live" : sale.status === "ending" ? "Ending Soon" : "Completed"}
                </Badge>
                <CardDescription className="text-sm">{sale.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      ${(sale.raised / 1000).toFixed(0)}K / ${(sale.target / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress value={(sale.raised / sale.target) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{sale.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{sale.timeLeft}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={sale.status === "completed"}
                  variant={sale.status === "completed" ? "secondary" : "default"}
                >
                  {sale.status === "completed" ? "Sale Ended" : "Participate"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trending Projects Section */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 text-balance text-white">View the Trends on Launch Stream</h2>
            <p className="text-xl text-white/90 text-pretty max-w-2xl mx-auto">
              Track the hottest performing tokens from our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={project.logo || "/placeholder.svg"}
                      alt={project.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.symbol}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">24h Change</span>
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {project.change}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Volume</span>
                      <span className="font-semibold">{project.volume}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-white hover:bg-primary/10 bg-transparent"
            >
              View All Trending Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
