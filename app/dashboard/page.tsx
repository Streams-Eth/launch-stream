"use client"

import { useWeb3 } from "@/hooks/use-web3"
import { UserDashboard } from "@/components/user-dashboard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { WalletConnectModal } from "@/components/wallet-connect-modal"

export default function DashboardPage() {
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWeb3()
  const [showWalletModal, setShowWalletModal] = useState(false)

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="mx-auto p-4 rounded-full bg-blue-500/10 w-fit mb-4">
                  <Wallet className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Connect Your Wallet</CardTitle>
                <CardDescription className="text-slate-300">
                  Connect your wallet to access your dashboard and manage your investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowWalletModal(true)}
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} onConnect={connectWallet} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <UserDashboard
        user={{
          address: address!,
          balance: balance!,
          walletType: "MetaMask",
        }}
        onDisconnect={disconnectWallet}
      />
    </main>
  )
}
