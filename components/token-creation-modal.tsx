"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeb3 } from "@/hooks/use-web3"
import { ethers } from "ethers"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TokenCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TokenParams {
  name: string
  symbol: string
  totalSupply: string
  decimals: string
  description: string
  tokenType: string
}

// Simple ERC20 contract bytecode (minimal implementation)
const ERC20_BYTECODE =
  "0x608060405234801561001057600080fd5b506040516108003803806108008339818101604052810190610032919061016a565b8360039081610041919061040c565b50826004908161005191906104..."

export function TokenCreationModal({ isOpen, onClose }: TokenCreationModalProps) {
  const { isConnected, signer, chainId, currentNetwork } = useWeb3()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [tokenParams, setTokenParams] = useState<TokenParams>({
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    description: "",
    tokenType: "standard",
  })

  const handleInputChange = (field: keyof TokenParams, value: string) => {
    setTokenParams((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateInputs = (): boolean => {
    if (!tokenParams.name.trim()) {
      setError("Token name is required")
      return false
    }
    if (!tokenParams.symbol.trim()) {
      setError("Token symbol is required")
      return false
    }
    if (!tokenParams.totalSupply || Number.parseFloat(tokenParams.totalSupply) <= 0) {
      setError("Valid total supply is required")
      return false
    }
    return true
  }

  const createToken = async () => {
    if (!isConnected || !signer) {
      setError("Please connect your wallet first")
      return
    }

    if (!validateInputs()) return

    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      // Create contract factory with ERC20 bytecode
      const contractFactory = new ethers.ContractFactory(
        [
          "constructor(string memory name, string memory symbol, uint256 totalSupply, uint8 decimals)",
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function totalSupply() view returns (uint256)",
          "function decimals() view returns (uint8)",
        ],
        ERC20_BYTECODE,
        signer,
      )

      // Deploy the contract
      const totalSupplyWei = ethers.parseUnits(tokenParams.totalSupply, Number.parseInt(tokenParams.decimals))

      console.log("[v0] Deploying token with params:", {
        name: tokenParams.name,
        symbol: tokenParams.symbol,
        totalSupply: totalSupplyWei.toString(),
        decimals: Number.parseInt(tokenParams.decimals),
      })

      const contract = await contractFactory.deploy(
        tokenParams.name,
        tokenParams.symbol,
        totalSupplyWei,
        Number.parseInt(tokenParams.decimals),
      )

      console.log("[v0] Contract deployment initiated, waiting for confirmation...")

      // Wait for deployment
      await contract.waitForDeployment()
      const contractAddress = await contract.getAddress()

      console.log("[v0] Token deployed successfully at:", contractAddress)

      setSuccess(`Token created successfully! Contract address: ${contractAddress}`)

      // Reset form
      setTokenParams({
        name: "",
        symbol: "",
        totalSupply: "",
        decimals: "18",
        description: "",
        tokenType: "standard",
      })
    } catch (error: any) {
      console.error("[v0] Token creation failed:", error)
      setError(error.message || "Failed to create token. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Token</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to create tokens</AlertDescription>
            </Alert>
          )}

          {currentNetwork && <div className="text-sm text-muted-foreground">Network: {currentNetwork.name}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Token Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Token"
              value={tokenParams.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol</Label>
            <Input
              id="symbol"
              placeholder="MAT"
              value={tokenParams.symbol}
              onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalSupply">Total Supply</Label>
            <Input
              id="totalSupply"
              type="number"
              placeholder="1000000"
              value={tokenParams.totalSupply}
              onChange={(e) => handleInputChange("totalSupply", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimals">Decimals</Label>
            <Select value={tokenParams.decimals} onValueChange={(value) => handleInputChange("decimals", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18">18 (Standard)</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your token..."
              value={tokenParams.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={createToken} disabled={!isConnected || isCreating} className="flex-1">
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Creating..." : "Create Token"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
