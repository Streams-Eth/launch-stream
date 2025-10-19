import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Shield, Zap } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Every smart contract is audited and battle-tested for maximum security",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by the community, for the community with transparent governance",
  },
  {
    icon: Target,
    title: "Innovation Focus",
    description: "Constantly pushing the boundaries of what's possible in DeFi",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed and efficiency across all our services",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">About Launch Stream</Badge>

          <h1 className="text-5xl font-black text-balance mb-6">Empowering the Future of DeFi</h1>

          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Launch Stream's decentralized platform for token creation, presales, liquidity locking, and
            airdrops. We're building the infrastructure that powers the next generation of DeFi projects.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground">
              To create a user-friendly DeFi tools and make it easy for anyone to launch their own tokens.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Building the DeFi Infrastructure</h3>
              <p className="text-muted-foreground mb-6">
                Since our inception, we've been committed to creating user-friendly tools that enable anyone to
                participate in the DeFi ecosystem. Launch Stream's platform will facilitate secure token launches and serves
                thousands of projects worldwide.
              </p>
              <p className="text-muted-foreground">
                We believe in transparency, security, and community-driven development. Every feature we build is
                designed with our users' success in mind.
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-primary mb-2">$0</div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-2">0</div>
                  <div className="text-sm text-muted-foreground">Projects Launched</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-2">2</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
