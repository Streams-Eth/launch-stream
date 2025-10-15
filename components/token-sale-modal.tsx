"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWeb3 } from "@/hooks/use-web3"
import { ethers } from "ethers"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TokenSaleModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SaleParams {
  tokenAddress: string
  salePrice: string
  softCap: string
  hardCap: string
  minBuy: string
  maxBuy: string
  startDate: string
  endDate: string
  description: string
}

export function TokenSaleModal({ isOpen, onClose }: TokenSaleModalProps) {
  const { isConnected, signer, chainId, currentNetwork } = useWeb3()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [saleParams, setSaleParams] = useState<SaleParams>({
    tokenAddress: "",
    salePrice: "",
    softCap: "",
    hardCap: "",
    minBuy: "",
    maxBuy: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleInputChange = (field: keyof SaleParams, value: string) => {
    setSaleParams((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateInputs = (): boolean => {
    if (!ethers.isAddress(saleParams.tokenAddress)) {
      setError("Valid token address is required")
      return false
    }
    if (!saleParams.salePrice || Number.parseFloat(saleParams.salePrice) <= 0) {
      setError("Valid sale price is required")
      return false
    }
    if (!saleParams.softCap || Number.parseFloat(saleParams.softCap) <= 0) {
      setError("Valid soft cap is required")
      return false
    }
    if (!saleParams.hardCap || Number.parseFloat(saleParams.hardCap) <= Number.parseFloat(saleParams.softCap)) {
      setError("Hard cap must be greater than soft cap")
      return false
    }
    return true
  }

  const createSale = async () => {
    if (!isConnected || !signer) {
      setError("Please connect your wallet first")
      return
    }

    if (!validateInputs()) return

    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      // Simple presale contract creation
      const presaleFactory = new ethers.ContractFactory(
        [
          "constructor(address token, uint256 rate, uint256 softCap, uint256 hardCap, uint256 minBuy, uint256 maxBuy, uint256 startTime, uint256 endTime)",
          "function buyTokens() payable",
          "function claimTokens()",
          "function finalizeSale()",
        ],
        "0x608060405234801561001057600080fd5b50604051610800380380610800833981810160405281019061003291906101...", // Presale bytecode
        signer,
      )

      const startTime = Math.floor(new Date(saleParams.startDate).getTime() / 1000)
      const endTime = Math.floor(new Date(saleParams.endDate).getTime() / 1000)
      const rate = ethers.parseUnits(saleParams.salePrice, 18)
      const softCap = ethers.parseEther(saleParams.softCap)
      const hardCap = ethers.parseEther(saleParams.hardCap)
      const minBuy = ethers.parseEther(saleParams.minBuy)
      const maxBuy = ethers.parseEther(saleParams.maxBuy)

      console.log("[v0] Creating token sale with params:", {
        tokenAddress: saleParams.tokenAddress,
        rate: rate.toString(),
        softCap: softCap.toString(),
        hardCap: hardCap.toString(),
        startTime,
        endTime,
      })

      const presale = await presaleFactory.deploy(
        saleParams.tokenAddress,
        rate,
        softCap,
        hardCap,
        minBuy,
        maxBuy,
        startTime,
        endTime,
      )

      await presale.waitForDeployment()
      const presaleAddress = await presale.getAddress()

      console.log("[v0] Token sale created successfully at:", presaleAddress)

      setSuccess(`Token sale created successfully! Presale address: ${presaleAddress}`)

      // Reset form
      setSaleParams({
        tokenAddress: "",
        salePrice: "",
        softCap: "",
        hardCap: "",
        minBuy: "",
        maxBuy: "",
        startDate: "",
        endDate: "",
        description: "",
      })
    } catch (error: any) {
      console.error("[v0] Token sale creation failed:", error)
      setError(error.message || "Failed to create token sale. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Token Sale</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to create token sales</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Contract Address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={saleParams.tokenAddress}
              onChange={(e) => handleInputChange("tokenAddress", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salePrice">Price per Token ({currentNetwork?.nativeCurrency.symbol})</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.000001"
                placeholder="0.001"
                value={saleParams.salePrice}
                onChange={(e) => handleInputChange("salePrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="softCap">Soft Cap ({currentNetwork?.nativeCurrency.symbol})</Label>
              <Input
                id="softCap"
                type="number"
                placeholder="10"
                value={saleParams.softCap}
                onChange={(e) => handleInputChange("softCap", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hardCap">Hard Cap ({currentNetwork?.nativeCurrency.symbol})</Label>
              <Input
                id="hardCap"
                type="number"
                placeholder="100"
                value={saleParams.hardCap}
                onChange={(e) => handleInputChange("hardCap", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minBuy">Min Buy ({currentNetwork?.nativeCurrency.symbol})</Label>
              <Input
                id="minBuy"
                type="number"
                step="0.01"
                placeholder="0.1"
                value={saleParams.minBuy}
                onChange={(e) => handleInputChange("minBuy", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxBuy">Max Buy ({currentNetwork?.nativeCurrency.symbol})</Label>
            <Input
              id="maxBuy"
              type="number"
              placeholder="10"
              value={saleParams.maxBuy}
              onChange={(e) => handleInputChange("maxBuy", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={saleParams.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={saleParams.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your token sale..."
              value={saleParams.description}
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
            <Button onClick={createSale} disabled={!isConnected || isCreating} className="flex-1">
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Creating..." : "Create Sale"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
