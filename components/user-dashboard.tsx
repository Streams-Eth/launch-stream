"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Copy, Settings, LogOut } from "lucide-react"

interface UserDashboardProps {
  user: {
    address: string
    balance: string
    walletType: string
  }
  onDisconnect: () => void
}

const userInvestments = [
  {
    name: "DeFiMax Protocol",
    symbol: "DMAX",
    invested: "$2,500",
    currentValue: "$3,200",
    change: "+28%",
    status: "active",
    logo: "/defi-protocol-logo-blue.jpg",
  },
  {
    name: "GameFi Arena",
    symbol: "GFA",
    invested: "$1,800",
    currentValue: "$2,100",
    change: "+16.7%",
    status: "active",
    logo: "/gaming-token-logo-purple.jpg",
  },
  {
    name: "EcoChain",
    symbol: "ECO",
    invested: "$1,200",
    currentValue: "$1,050",
    change: "-12.5%",
    status: "ended",
    logo: "/green-eco-blockchain-logo.jpg",
  },
]

const recentTransactions = [
  {
    type: "Investment",
    project: "DeFiMax Protocol",
    amount: "$2,500",
    date: "2 hours ago",
    status: "completed",
  },
  {
    type: "Claim",
    project: "GameFi Arena",
    amount: "$150",
    date: "1 day ago",
    status: "completed",
  },
  {
    type: "Investment",
    project: "EcoChain",
    amount: "$1,200",
    date: "3 days ago",
    status: "completed",
  },
]

export function UserDashboard({ user, onDisconnect }: UserDashboardProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(user.address)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-muted-foreground">Manage your investments and track performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={onDisconnect}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>

      {/* Wallet Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">{formatAddress(user.address)}</code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className="text-2xl font-bold">{user.balance} ETH</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Connected via</p>
              <Badge variant="secondary">{user.walletType}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="investments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investments">My Investments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="investments" className="space-y-6">
          <div className="grid gap-6">
            {userInvestments.map((investment, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={investment.logo || "/placeholder.svg"}
                        alt={investment.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{investment.name}</h3>
                        <p className="text-sm text-muted-foreground">{investment.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{investment.currentValue}</p>
                      <p className={`text-sm ${investment.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {investment.change}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Invested</p>
                      <p className="font-medium">{investment.invested}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant={investment.status === "active" ? "default" : "secondary"}>
                        {investment.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transaction.amount}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">$6,350</div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18.5% this month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">3</div>
                <div className="text-muted-foreground">Projects</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
