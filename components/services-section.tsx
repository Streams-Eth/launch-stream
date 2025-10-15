import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Lock, Zap } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Coins,
    title: "StreamsMint", // renamed from LaunchMint
    description: "Create and deploy your own tokens with advanced features and customizable parameters.",
    features: ["Token Creation", "Smart Contracts", "Custom Parameters"],
    href: "/streamsmint",
  },
  {
    icon: TrendingUp,
    title: "StreamsSale", // renamed from LaunchSale
    description: "Host presales and token sales with built-in security and automated distribution.",
    features: ["Presale Management", "Automated Distribution", "Security Features"],
    href: "/streamssale",
  },
  {
    icon: Lock,
    title: "StreamsLock", // renamed from LaunchLock
    description: "Lock liquidity and tokens with time-based releases for enhanced trust and security.",
    features: ["Liquidity Locking", "Time-based Releases", "Trust Building"],
    href: "/streamslock",
  },
  {
    icon: Zap,
    title: "StreamsDrop", // renamed from LaunchDrop
    description: "Distribute tokens through airdrops with advanced targeting and claim mechanisms.",
    features: ["Airdrop Distribution", "Advanced Targeting", "Claim Mechanisms"],
    href: "/streamsdrop",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 text-balance">Build Your Ideas</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Comprehensive DeFi tools to bring your token project from concept to launch
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.href}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
