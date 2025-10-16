"use client"
export const dynamic = "force-dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Clock, Target, Zap, Shield, CreditCard, Wallet, Home } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import Link from "next/link"
import nextDynamic from "next/dynamic"

const PresalePayPal = nextDynamic(() => import("./PresalePayPal"), { ssr: false })

export default function PresalePage() {
  const { isConnected, address, connectWallet } = useWeb3()
  const [ethAmount, setEthAmount] = useState("")
  const [lstAmount, setLstAmount] = useState("")

  const presaleData = {
    totalSupply: 400000000, // 400M LST for presale
    sold: 0, // Reset to 0 as requested
    price: 0.0001, // 0.0001 ETH per LST
    lstUsdPrice: 0.045, // $0.045 per LST
    ethToUsd: 450, // If 0.0001 ETH = $0.045, then 1 ETH = $450
    minBuy: 0.1, // 0.1 ETH minimum
    maxBuy: 10, // 10 ETH maximum
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // 3 days + 12 hours from now (12pm PST)
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 90 * 24 * 60 * 60 * 1000), // 90 days after start
  }

  const progress = (presaleData.sold / presaleData.totalSupply) * 100
  const remaining = presaleData.totalSupply - presaleData.sold

  const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEthAmount(value)
    if (value && !isNaN(Number.parseFloat(value))) {
      const lstTokens = Number.parseFloat(value) / presaleData.price
      setLstAmount(lstTokens.toLocaleString())
    } else {
      setLstAmount("")
    }
  }

  const handleCryptoPayment = () => {
    if (!isConnected) {
      connectWallet()
      return
    }
    alert(`Purchasing ${lstAmount} LST tokens for ${ethAmount} ETH`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            🔥 Live Presale
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Launch Stream Token
            <span className="text-blue-400"> Presale</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Join the future of decentralized launchpad services. Get LST tokens at presale price with exclusive benefits.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Presale Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Presale Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tokens Sold</span>
                    <span className="text-white font-semibold">
                      {presaleData.sold.toLocaleString()} / {presaleData.totalSupply.toLocaleString()} LST
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{progress.toFixed(1)}% Complete</span>
                    <span>{remaining.toLocaleString()} LST Remaining</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">0.0001</div>
                    <div className="text-xs text-slate-400">ETH per LST</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">0</div>
                    <div className="text-xs text-slate-400">Participants</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">0.0</div>
                    <div className="text-xs text-slate-400">ETH Raised</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">3</div>
                    <div className="text-xs text-slate-400">Days to Start</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Benefits Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Presale Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="text-white font-semibold">50% Discount</h4>
                        <p className="text-slate-400 text-sm">Get LST tokens at 50% below listing price</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="text-white font-semibold">No Vesting</h4>
                        <p className="text-slate-400 text-sm">Tokens available immediately after presale</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="text-white font-semibold">Bonus Rewards</h4>
                        <p className="text-slate-400 text-sm">Extra 10% tokens for early participants</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="text-white font-semibold">Priority Access</h4>
                        <p className="text-slate-400 text-sm">First access to new platform features</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="text-white font-semibold">Governance Rights</h4>
                        <p className="text-slate-400 text-sm">Vote on platform decisions and upgrades</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="text-white font-semibold">Staking Rewards</h4>
                        <p className="text-slate-400 text-sm">Earn passive income from platform fees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Purchase Card */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Purchase LST Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input for Crypto */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eth-amount" className="text-white">
                      ETH Amount
                    </Label>
                    <Input
                      id="eth-amount"
                      type="number"
                      placeholder="0.1"
                      value={ethAmount}
                      onChange={handleEthAmountChange}
                      className="bg-slate-900/50 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-400">
                      Minimum: 0.1 ETH • Maximum: 10 ETH
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">LST Tokens You'll Receive</Label>
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="text-2xl font-bold text-blue-400">{lstAmount || "0"} LST</div>
                      <div className="text-xs text-slate-400">@ {presaleData.price} ETH per LST</div>
                    </div>
                  </div>
                </div>
                <Separator />
                {/* Purchase Button for Crypto */}
                <div className="space-y-4">
                  <Button
                    onClick={handleCryptoPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={!ethAmount || Number.parseFloat(ethAmount) < presaleData.minBuy}
                  >
                    {!isConnected ? "Connect Wallet" : "Purchase with Crypto"}
                  </Button>
                  {isConnected && (
                    <div className="text-xs text-slate-400 text-center">
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                  )}
                </div>
                {/* Security Notice */}
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-400 mt-0.5" />
                    <div className="text-xs text-slate-400">
                      <strong className="text-green-400">Secure Transaction:</strong> All payments are processed through audited smart contracts. Your tokens will be available immediately after purchase.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* PayPal Purchase Card (client-only) */}
            <PresalePayPal presaleData={presaleData} />
            {/* Timer Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Presale Ends In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-slate-900/50 rounded">
                    <div className="text-xl font-bold text-white">38</div>
                    <div className="text-xs text-slate-400">Days</div>
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded">
                    <div className="text-xl font-bold text-white">14</div>
                    <div className="text-xs text-slate-400">Hours</div>
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded">
                    <div className="text-xl font-bold text-white">27</div>
                    <div className="text-xs text-slate-400">Minutes</div>
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded">
                    <div className="text-xl font-bold text-white">43</div>
                    <div className="text-xs text-slate-400">Seconds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
