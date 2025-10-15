"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Boxes as Tokens, Droplets, ChevronDown, ChevronUp, Upload, Check } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"

export default function StreamsLockPage() {
  const { isConnected, address, connectWallet } = useWeb3()
  const [selectedLockType, setSelectedLockType] = useState("tokens")
  const [tokenAddress, setTokenAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [enableVesting, setEnableVesting] = useState(false)
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [websiteLink, setWebsiteLink] = useState("")
  const [twitterLink, setTwitterLink] = useState("")
  const [referralCode, setReferralCode] = useState("")

  const [expandedSections, setExpandedSections] = useState({
    lockType: true,
    tokenAddress: false,
    amount: false,
    vesting: false,
    endTime: false,
    projectInfo: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const lockTypes = [
    {
      id: "tokens",
      title: "Lock Tokens",
      icon: Tokens,
      description: "Lock ERC-20 tokens with time-based release",
    },
    {
      id: "liquidity-v2",
      title: "Lock Liquidity V2",
      icon: Droplets,
      description: "Lock Uniswap V2 LP tokens",
    },
    {
      id: "liquidity-v3",
      title: "Lock Liquidity V3",
      icon: Droplets,
      description: "Lock Uniswap V3 LP positions",
    },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Create a <span className="text-blue-400">Lock</span>
          </h1>
        </div>

        {/* Step 1: Select Lock Type */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleSection("lockType")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <CardTitle className="text-white">Select Lock Type</CardTitle>
            </div>
            {expandedSections.lockType ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedSections.lockType && (
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {lockTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLockType === type.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => setSelectedLockType(type.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <type.icon className="w-6 h-6 text-blue-400" />
                      <h3 className="font-semibold">{type.title}</h3>
                    </div>
                    <Button variant={selectedLockType === type.id ? "default" : "outline"} size="sm" className="w-full">
                      {selectedLockType === type.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Step 2: Insert Token Address */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleSection("tokenAddress")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <CardTitle className="text-white">Insert Token Address</CardTitle>
            </div>
            {expandedSections.tokenAddress ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedSections.tokenAddress && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="token-address" className="text-white mb-2 block">
                    Token Address
                  </Label>
                  <Input
                    id="token-address"
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-sm text-slate-400 mt-1">
                    The Token Address is the contract Address of your Smart Contract. You can find it with your wallet.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Token Name: -</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tokens className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Total Supply: -</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Tokens Approved for Locking: -</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Your Wallet Balance: -</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Step 3: Select Amount */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleSection("amount")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <CardTitle className="text-white">Select the amount</CardTitle>
            </div>
            {expandedSections.amount ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedSections.amount && (
            <CardContent>
              <Label htmlFor="amount" className="text-white mb-2 block">
                Amount
              </Label>
              <Input
                id="amount"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </CardContent>
          )}
        </Card>

        {/* Step 4: Token Vesting */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleSection("vesting")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                4
              </div>
              <CardTitle className="text-white">Token Vesting</CardTitle>
            </div>
            {expandedSections.vesting ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedSections.vesting && (
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Switch id="enable-vesting" checked={enableVesting} onCheckedChange={setEnableVesting} />
                <Label htmlFor="enable-vesting" className="text-white">
                  Enable Vested Claim
                </Label>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-slate-300 mb-4">
                  Token Vesting is an optional feature that you can use to periodically withdraw your tokens.
                </p>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• With Vested Claim you can claim your tokens periodically rather than at once.</li>
                  <li>• Everytime a vesting period passes you can claim the vested tokens for that period.</li>
                  <li>• This feature is useful to give you access to your tokens more regularly.</li>
                  <li>• Show proof of vested lock to your users.</li>
                </ul>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Step 5: Select End Time */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleSection("endTime")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                <Check className="w-4 h-4" />
              </div>
              <CardTitle className="text-white">Select the end time</CardTitle>
            </div>
            {expandedSections.endTime ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedSections.endTime && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="end-date" className="text-white mb-2 block">
                    Unlock end time
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="end-time" className="text-white mb-2 block">
                    Adjust Time
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select your interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Step 6: Project Information */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleSection("projectInfo")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                6
              </div>
              <CardTitle className="text-white">Add a logo and a link to your project</CardTitle>
            </div>
            {expandedSections.projectInfo ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedSections.projectInfo && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website" className="text-white mb-2 block">
                  Website Link
                </Label>
                <Input
                  id="website"
                  placeholder="https://yourproject.com"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-sm text-slate-400 mt-1">
                  Provide a link to your project website or to your Telegram
                </p>
              </div>
              <div>
                <Label htmlFor="twitter" className="text-white mb-2 block">
                  Twitter Link
                </Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/yourproject"
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-sm text-slate-400 mt-1">Provide a link to your project twitter / X</p>
              </div>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400 mb-2">Drag and drop your image here or Browse</p>
                <p className="text-xs text-slate-500">PNG, WEBP, JPG are allowed</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Referral Code */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                placeholder="Referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                Check
              </Button>
            </div>
            <p className="text-sm text-slate-400 mt-2">Provide a correct referral code</p>
          </CardContent>
        </Card>

        {/* Lock Button */}
        <div className="text-center">
          {!isConnected ? (
            <Button onClick={connectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Connect Wallet
            </Button>
          ) : (
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              LOCK TOKENS
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
