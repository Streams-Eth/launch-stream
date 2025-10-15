"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWeb3 } from "@/hooks/use-web3"
import { ethers } from "ethers"
import { Loader2, AlertCircle, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TokenLockModalProps {
  isOpen: boolean
  onClose: () => void
}

interface LockParams {
  tokenAddress: string
  amount: string
  unlockDate: string
  beneficiary: string
  description: string
}

export function TokenLockModal({ isOpen, onClose }: TokenLockModalProps) {
  const { isConnected, signer, currentNetwork } = useWeb3()
  const [isLocking, setIsLocking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [lockParams, setLockParams] = useState<LockParams>({
    tokenAddress: "",
    amount: "",
    unlockDate: "",
    beneficiary: "",
    description: "",
  })

  const handleInputChange = (field: keyof LockParams, value: string) => {
    setLockParams((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateInputs = (): boolean => {
    if (!ethers.isAddress(lockParams.tokenAddress)) {
      setError("Valid token address is required")
      return false
    }
    if (!lockParams.amount || Number.parseFloat(lockParams.amount) <= 0) {
      setError("Valid token amount is required")
      return false
    }
    if (!lockParams.unlockDate) {
      setError("Unlock date is required")
      return false
    }
    if (!ethers.isAddress(lockParams.beneficiary)) {
      setError("Valid beneficiary address is required")
      return false
    }
    return true
  }

  const lockTokens = async () => {
    if (!isConnected || !signer) {
      setError("Please connect your wallet first")
      return
    }

    if (!validateInputs()) return

    setIsLocking(true)
    setError(null)
    setSuccess(null)

    try {
      // Token locker contract creation
      const lockerFactory = new ethers.ContractFactory(
        [
          "constructor(address token, uint256 amount, uint256 unlockTime, address beneficiary)",
          "function unlock()",
          "function getLockedAmount() view returns (uint256)",
          "function getUnlockTime() view returns (uint256)",
        ],
        "0x608060405234801561001057600080fd5b50604051610600380380610600833981810160405281019061003291906101...", // Locker bytecode
        signer,
      )

      const unlockTime = Math.floor(new Date(lockParams.unlockDate).getTime() / 1000)
      const amount = ethers.parseUnits(lockParams.amount, 18)

      console.log("[v0] Creating token lock with params:", {
        tokenAddress: lockParams.tokenAddress,
        amount: amount.toString(),
        unlockTime,
        beneficiary: lockParams.beneficiary,
      })

      // First approve tokens to be locked
      const tokenContract = new ethers.Contract(
        lockParams.tokenAddress,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer,
      )

      const approveTx = await tokenContract.approve(signer.address, amount)
      await approveTx.wait()

      // Deploy locker contract
      const locker = await lockerFactory.deploy(lockParams.tokenAddress, amount, unlockTime, lockParams.beneficiary)

      await locker.waitForDeployment()
      const lockerAddress = await locker.getAddress()

      console.log("[v0] Token lock created successfully at:", lockerAddress)

      setSuccess(`Tokens locked successfully! Lock contract: ${lockerAddress}`)

      // Reset form
      setLockParams({
        tokenAddress: "",
        amount: "",
        unlockDate: "",
        beneficiary: "",
        description: "",
      })
    } catch (error: any) {
      console.error("[v0] Token lock failed:", error)
      setError(error.message || "Failed to lock tokens. Please try again.")
    } finally {
      setIsLocking(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Lock Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to lock tokens</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Contract Address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={lockParams.tokenAddress}
              onChange={(e) => handleInputChange("tokenAddress", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Lock</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000"
              value={lockParams.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unlockDate">Unlock Date</Label>
            <Input
              id="unlockDate"
              type="datetime-local"
              value={lockParams.unlockDate}
              onChange={(e) => handleInputChange("unlockDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiary">Beneficiary Address</Label>
            <Input
              id="beneficiary"
              placeholder="0x... (who can unlock the tokens)"
              value={lockParams.beneficiary}
              onChange={(e) => handleInputChange("beneficiary", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Purpose of this token lock..."
              value={lockParams.description}
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
            <Button onClick={lockTokens} disabled={!isConnected || isLocking} className="flex-1">
              {isLocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLocking ? "Locking..." : "Lock Tokens"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
