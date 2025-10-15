"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Shield, ExternalLink } from "lucide-react"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (walletType: string) => void
}

const wallets = [
  {
    name: "MetaMask",
    icon: "/metamask-fox-logo.jpg",
    description: "Connect using browser extension",
    popular: true,
  },
  {
    name: "WalletConnect",
    icon: "/walletconnect-blue-logo.jpg",
    description: "Scan with WalletConnect to connect",
    popular: true,
  },
  {
    name: "Coinbase Wallet",
    icon: "/coinbase-blue-logo.jpg",
    description: "Connect using Coinbase Wallet",
    popular: false,
  },
  {
    name: "Trust Wallet",
    icon: "/trust-wallet-blue-logo.jpg",
    description: "Connect using Trust Wallet mobile app",
    popular: false,
  },
]

export function WalletConnectModal({ open, onOpenChange, onConnect }: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletType: string) => {
    setConnecting(walletType)
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onConnect(walletType)
    setConnecting(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>Choose your preferred wallet to connect to Launch Stream</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Card
              key={wallet.name}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
              onClick={() => handleConnect(wallet.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{wallet.name}</h3>
                      {wallet.popular && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Popular</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{wallet.description}</p>
                  </div>
                  {connecting === wallet.name ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
          <Shield className="w-4 h-4" />
          <span>Your wallet connection is secure and encrypted</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
