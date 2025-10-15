"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWeb3 } from "@/hooks/use-web3"
import { ethers } from "ethers"
import { Loader2, AlertCircle, Gift } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AirdropModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AirdropParams {
  tokenAddress: string
  totalAmount: string
  recipients: string
  description: string
}

export function AirdropModal({ isOpen, onClose }: AirdropModalProps) {
  const { isConnected, signer, currentNetwork } = useWeb3()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [airdropParams, setAirdropParams] = useState<AirdropParams>({
    tokenAddress: "",
    totalAmount: "",
    recipients: "",
    description: "",
  })

  const handleInputChange = (field: keyof AirdropParams, value: string) => {
    setAirdropParams((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const parseRecipients = (recipientsText: string): { address: string; amount: string }[] => {
    const lines = recipientsText.trim().split("\n")
    const recipients: { address: string; amount: string }[] = []

    for (const line of lines) {
      const parts = line.trim().split(",")
      if (parts.length === 2) {
        const address = parts[0].trim()
        const amount = parts[1].trim()
        if (ethers.isAddress(address) && Number.parseFloat(amount) > 0) {
          recipients.push({ address, amount })
        }
      }
    }

    return recipients
  }

  const validateInputs = (): boolean => {
    if (!ethers.isAddress(airdropParams.tokenAddress)) {
      setError("Valid token address is required")
      return false
    }
    if (!airdropParams.totalAmount || Number.parseFloat(airdropParams.totalAmount) <= 0) {
      setError("Valid total amount is required")
      return false
    }

    const recipients = parseRecipients(airdropParams.recipients)
    if (recipients.length === 0) {
      setError("At least one valid recipient is required (format: address,amount)")
      return false
    }

    return true
  }

  const createAirdrop = async () => {
    if (!isConnected || !signer) {
      setError("Please connect your wallet first")
      return
    }

    if (!validateInputs()) return

    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      const recipients = parseRecipients(airdropParams.recipients)

      // Simple batch transfer approach
      const tokenContract = new ethers.Contract(
        airdropParams.tokenAddress,
        [
          "function transfer(address to, uint256 amount) returns (bool)",
          "function balanceOf(address account) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ],
        signer,
      )

      console.log("[v0] Starting airdrop to", recipients.length, "recipients")

      // Check balance first
      const balance = await tokenContract.balanceOf(signer.address)
      const decimals = await tokenContract.decimals()

      let totalRequired = ethers.parseUnits("0", decimals)
      for (const recipient of recipients) {
        totalRequired += ethers.parseUnits(recipient.amount, decimals)
      }

      if (balance < totalRequired) {
        setError("Insufficient token balance for airdrop")
        return
      }

      // Execute transfers
      const transactions = []
      for (const recipient of recipients) {
        const amount = ethers.parseUnits(recipient.amount, decimals)
        const tx = await tokenContract.transfer(recipient.address, amount)
        transactions.push(tx.hash)

        console.log("[v0] Sent", recipient.amount, "tokens to", recipient.address)
      }

      setSuccess(
        `Airdrop completed! ${recipients.length} transfers executed. Total: ${airdropParams.totalAmount} tokens`,
      )

      // Reset form
      setAirdropParams({
        tokenAddress: "",
        totalAmount: "",
        recipients: "",
        description: "",
      })
    } catch (error: any) {
      console.error("[v0] Airdrop failed:", error)
      setError(error.message || "Failed to execute airdrop. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Create Airdrop
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to create airdrops</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Contract Address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={airdropParams.tokenAddress}
              onChange={(e) => handleInputChange("tokenAddress", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount to Distribute</Label>
            <Input
              id="totalAmount"
              type="number"
              placeholder="10000"
              value={airdropParams.totalAmount}
              onChange={(e) => handleInputChange("totalAmount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients (one per line: address,amount)</Label>
            <Textarea
              id="recipients"
              placeholder="0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4,100&#10;0x123...,50&#10;0x456...,25"
              value={airdropParams.recipients}
              onChange={(e) => handleInputChange("recipients", e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">Format: wallet_address,token_amount (one per line)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe this airdrop campaign..."
              value={airdropParams.description}
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
            <Button onClick={createAirdrop} disabled={!isConnected || isCreating} className="flex-1">
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Executing..." : "Execute Airdrop"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
