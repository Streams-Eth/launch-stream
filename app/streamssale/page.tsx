"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Upload, Loader2 } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { ethers } from "ethers"

interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  balance: string
}

export default function StreamsSalePage() {
  const [selectedLaunchType, setSelectedLaunchType] = useState("presale")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [enableWhitelist, setEnableWhitelist] = useState(false)
  const [enableVesting, setEnableVesting] = useState(false)
  const [enableAffiliate, setEnableAffiliate] = useState(false)
  const { isConnected, connectWallet, address } = useWeb3()

  const launchTypes = [
    { id: "presale", name: "Presale", description: "Standard presale with soft/hard cap" },
    { id: "fairlaunch", name: "Fairlaunch", description: "No presale, direct liquidity launch" },
    { id: "overflow", name: "Overflow", description: "Overflow presale with guaranteed allocation" },
    { id: "private", name: "Private Sale", description: "Private sale for selected investors" },
  ]

  const templates = [
    { id: "lowcap", name: "Low cap gem", softCap: "10 ETH", hardCap: "50 ETH", rate: "1000000" },
    { id: "midraise", name: "Mid raise", softCap: "100 ETH", hardCap: "500 ETH", rate: "100000" },
    { id: "longterm", name: "Long term raise", softCap: "500 ETH", hardCap: "2000 ETH", rate: "50000" },
  ]

  const importTokenInfo = async () => {
    if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
      setImportError("Please enter a valid token address")
      return
    }

    if (!isConnected) {
      setImportError("Please connect your wallet first")
      return
    }

    setIsImporting(true)
    setImportError(null)
    setTokenInfo(null)

    try {
      console.log("[v0] Importing token info for:", tokenAddress)

      // Get provider from window.ethereum
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Standard ERC20 ABI for token information
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function decimals() view returns (uint8)",
          "function totalSupply() view returns (uint256)",
          "function balanceOf(address) view returns (uint256)",
        ],
        provider,
      )

      // Fetch token information
      const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply(),
        tokenContract.balanceOf(address),
      ])

      const tokenData: TokenInfo = {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        balance: ethers.formatUnits(balance, decimals),
      }

      setTokenInfo(tokenData)
      console.log("[v0] Token info imported successfully:", tokenData)
    } catch (error: any) {
      console.error("[v0] Token import failed:", error)
      setImportError("Failed to import token information. Please check the address and try again.")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Create your <span className="text-blue-400">Presale</span>
          </h1>
          <p className="text-slate-400">Launch your token with StreamsSale's secure presale platform</p>
        </div>

        {/* Step 1: Choose Launch Type */}
        <Collapsible defaultOpen className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-lg font-semibold">Choose Launch Type</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {launchTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedLaunchType(type.id)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    selectedLaunchType === type.id
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div className="font-semibold text-sm">{type.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Step 2: Token Information */}
        <Collapsible defaultOpen className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-lg font-semibold">Token Information</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-4">
            <div>
              <Label htmlFor="tokenAddress" className="text-sm font-medium mb-2 block">
                Token Address *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tokenAddress"
                  value={tokenAddress}
                  onChange={(e) => {
                    setTokenAddress(e.target.value)
                    setTokenInfo(null)
                    setImportError(null)
                  }}
                  placeholder="0x..."
                  className="bg-slate-700 border-slate-600"
                />
                <Button
                  variant="outline"
                  className="border-slate-600 bg-transparent"
                  onClick={importTokenInfo}
                  disabled={isImporting || !tokenAddress}
                >
                  {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              </div>
            </div>

            {importError && (
              <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                <div className="text-sm text-red-400">{importError}</div>
              </div>
            )}

            {tokenInfo && (
              <div className="p-4 bg-slate-700 rounded-lg space-y-3">
                <div className="text-sm font-medium text-green-400 mb-2">✓ Token Information Imported</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Name:</span>
                    <div className="font-medium">{tokenInfo.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Symbol:</span>
                    <div className="font-medium">{tokenInfo.symbol}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Decimals:</span>
                    <div className="font-medium">{tokenInfo.decimals}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Supply:</span>
                    <div className="font-medium">{Number(tokenInfo.totalSupply).toLocaleString()}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Your Balance:</span>
                    <div className="font-medium">
                      {Number(tokenInfo.balance).toLocaleString()} {tokenInfo.symbol}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Step 3: Presale Information */}
        <Collapsible defaultOpen className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-lg font-semibold">Presale Information</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-6">
            {/* Templates */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Choose Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-semibold text-sm">{template.name}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {template.softCap} - {template.hardCap}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedTemplate("custom")}
                className={`w-full p-3 rounded-lg border text-center transition-all ${
                  selectedTemplate === "custom"
                    ? "border-blue-500 bg-blue-500/20 text-blue-400"
                    : "border-slate-600 hover:border-slate-500"
                }`}
              >
                Create your own
              </button>
            </div>

            {/* Custom Form */}
            {selectedTemplate === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="presaleRate" className="text-sm font-medium mb-2 block">
                    Presale Rate *
                  </Label>
                  <Input id="presaleRate" placeholder="1000000" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="softCap" className="text-sm font-medium mb-2 block">
                    Soft Cap (ETH) *
                  </Label>
                  <Input id="softCap" placeholder="10" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="hardCap" className="text-sm font-medium mb-2 block">
                    Hard Cap (ETH) *
                  </Label>
                  <Input id="hardCap" placeholder="100" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="minBuy" className="text-sm font-medium mb-2 block">
                    Min Buy (ETH) *
                  </Label>
                  <Input id="minBuy" placeholder="0.1" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="maxBuy" className="text-sm font-medium mb-2 block">
                    Max Buy (ETH) *
                  </Label>
                  <Input id="maxBuy" placeholder="10" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="listingRate" className="text-sm font-medium mb-2 block">
                    Listing Rate *
                  </Label>
                  <Input id="listingRate" placeholder="800000" className="bg-slate-700 border-slate-600" />
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Step 4: Presale Timings */}
        <Collapsible defaultOpen className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-lg font-semibold">Presale Timings</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-sm font-medium mb-2 block">
                  Start Time *
                </Label>
                <Input id="startTime" type="datetime-local" className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-sm font-medium mb-2 block">
                  End Time *
                </Label>
                <Input id="endTime" type="datetime-local" className="bg-slate-700 border-slate-600" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Step 5: Project Information */}
        <Collapsible defaultOpen className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                5
              </div>
              <span className="text-lg font-semibold">Project Information</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-4">
            <div>
              <Label htmlFor="logoUpload" className="text-sm font-medium mb-2 block">
                Logo Upload
              </Label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-sm font-medium mb-2 block">
                  Website
                </Label>
                <Input id="website" placeholder="https://yourproject.com" className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-sm font-medium mb-2 block">
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/yourproject"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="telegram" className="text-sm font-medium mb-2 block">
                  Telegram
                </Label>
                <Input id="telegram" placeholder="https://t.me/yourproject" className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="discord" className="text-sm font-medium mb-2 block">
                  Discord
                </Label>
                <Input
                  id="discord"
                  placeholder="https://discord.gg/yourproject"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Project Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your project..."
                className="bg-slate-700 border-slate-600"
                rows={4}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Step 6: Features */}
        <Collapsible defaultOpen className="mb-8">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                6
              </div>
              <span className="text-lg font-semibold">Features</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-slate-800/50 rounded-b-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Affiliate Earning</div>
                <div className="text-sm text-slate-400">Enable referral rewards for your presale</div>
              </div>
              <Switch checked={enableAffiliate} onCheckedChange={setEnableAffiliate} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Vested Claim</div>
                <div className="text-sm text-slate-400">Add vesting schedule for token claims</div>
              </div>
              <Switch checked={enableVesting} onCheckedChange={setEnableVesting} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Whitelist</div>
                <div className="text-sm text-slate-400">Restrict presale to whitelisted addresses</div>
              </div>
              <Switch checked={enableWhitelist} onCheckedChange={setEnableWhitelist} />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Referral Code */}
        <div className="mb-8">
          <Label htmlFor="referralCode" className="text-sm font-medium mb-2 block">
            Referral Code (Optional)
          </Label>
          <Input id="referralCode" placeholder="Enter referral code" className="bg-slate-700 border-slate-600" />
        </div>

        {/* Create Button */}
        <div className="text-center">
          {!isConnected ? (
            <Button onClick={connectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700 px-12">
              Connect Wallet
            </Button>
          ) : (
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-12">
              CREATE PRESALE
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
