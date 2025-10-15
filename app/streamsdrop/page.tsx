"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, CheckCircle2, Upload, Zap } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"

export default function StreamsDropPage() {
  const [selectedAirdropType, setSelectedAirdropType] = useState("native")
  const [userList, setUserList] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalAmount, setTotalAmount] = useState("0")
  const { isConnected, connectWallet } = useWeb3()

  const airdropTypes = [
    {
      id: "native",
      name: "Native Tokens",
      description: "Airdrop ETH, BNB, or other native tokens",
      icon: "💎",
    },
    {
      id: "custom",
      name: "Custom Tokens",
      description: "Airdrop your own ERC-20 tokens",
      icon: "🪙",
    },
  ]

  const instructions = [
    "Prepare your recipient list with addresses and amounts",
    "Choose between native tokens or custom ERC-20 tokens",
    "Set up your airdrop parameters and distribution method",
    "Review and confirm your airdrop details",
    "Execute the airdrop to all recipients simultaneously",
  ]

  const handleUserListChange = (value: string) => {
    setUserList(value)
    // Calculate total users and amount from the list
    const lines = value
      .trim()
      .split("\n")
      .filter((line) => line.trim())
    setTotalUsers(lines.length)

    let total = 0
    lines.forEach((line) => {
      const parts = line.split(",")
      if (parts.length >= 2) {
        const amount = Number.parseFloat(parts[1].trim())
        if (!isNaN(amount)) {
          total += amount
        }
      }
    })
    setTotalAmount(total.toString())
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-blue-500/20">
              <Zap className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-blue-400">StreamsDrop</span>
          </h1>
          <p className="text-slate-400">
            Distribute tokens efficiently to multiple recipients with our secure airdrop platform
          </p>
        </div>

        {/* Airdrop Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Choose Airdrop Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {airdropTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedAirdropType(type.id)}
                className={`p-6 rounded-lg border text-center transition-all ${
                  selectedAirdropType === type.id
                    ? "border-blue-500 bg-blue-500/20 text-blue-400"
                    : "border-slate-600 hover:border-slate-500 bg-slate-800"
                }`}
              >
                <div className="text-4xl mb-3">{type.icon}</div>
                <div className="font-semibold text-lg mb-2">{type.name}</div>
                <div className="text-sm text-slate-400">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">How to Set Up Your Airdrop</h3>
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{instruction}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Token Information */}
        {selectedAirdropType === "custom" && (
          <Collapsible defaultOpen className="mb-6">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-lg font-semibold">Token Information</span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-4">
              <div>
                <Label htmlFor="tokenAddress" className="text-sm font-medium mb-2 block">
                  Token Contract Address *
                </Label>
                <div className="flex gap-2">
                  <Input id="tokenAddress" placeholder="0x..." className="bg-slate-700 border-slate-600" />
                  <Button variant="outline" className="border-slate-600 bg-transparent">
                    Import
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Recipient List */}
        <Collapsible defaultOpen className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                {selectedAirdropType === "custom" ? "2" : "1"}
              </div>
              <span className="text-lg font-semibold">Set Up Airdrop Recipients</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-4">
            <div>
              <Label htmlFor="userList" className="text-sm font-medium mb-2 block">
                Recipient List (Address, Amount per line) *
              </Label>
              <Textarea
                id="userList"
                value={userList}
                onChange={(e) => handleUserListChange(e.target.value)}
                placeholder="0x1234..., 100&#10;0x5678..., 200&#10;0x9abc..., 150"
                className="bg-slate-700 border-slate-600 min-h-[200px] font-mono text-sm"
              />
              <div className="text-xs text-slate-400 mt-2">Format: wallet_address, amount (one per line)</div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="border-slate-600 bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
              <Button variant="outline" className="border-slate-600 bg-transparent">
                Import from Snapshot
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Summary */}
        {userList && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Airdrop Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{totalUsers}</div>
                  <div className="text-sm text-slate-400">Total Recipients</div>
                </div>
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{totalAmount}</div>
                  <div className="text-sm text-slate-400">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedAirdropType === "native" ? "ETH" : "Tokens"}
                  </div>
                  <div className="text-sm text-slate-400">Token Type</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Referral Code */}
        <div className="mb-8">
          <Label htmlFor="referralCode" className="text-sm font-medium mb-2 block">
            Referral Code (Optional)
          </Label>
          <Input id="referralCode" placeholder="Enter referral code" className="bg-slate-700 border-slate-600" />
        </div>

        {/* Airdrop Button */}
        <div className="text-center">
          {!isConnected ? (
            <Button onClick={connectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700 px-12">
              Connect Wallet
            </Button>
          ) : (
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-12" disabled={!userList || totalUsers === 0}>
              AIRDROP TOKENS
            </Button>
          )}
          {userList && totalUsers > 0 && (
            <p className="text-sm text-slate-400 mt-2">Ready to airdrop to {totalUsers} recipients</p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
