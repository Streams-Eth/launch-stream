"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Shield, Zap, Users, TrendingUp, Lock, Coins, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <Badge variant="secondary" className="mb-4">
            Version 1.0 - October 2025
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Launch Stream Token
            <span className="text-blue-400"> (LST)</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            A comprehensive tokenomics framework powering the next generation of decentralized launchpad services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Contracts
            </Button>
          </div>
        </div>

        {/* Contract Addresses */}
        <Card className="mb-12 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Deployed Contracts (Sepolia Testnet)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">LST Token</h4>
                <p className="text-xs text-slate-400 font-mono break-all">0x96a249aa69f2c1bc8564541d3f9580ef49e971d0</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">PreSale Factory</h4>
                <p className="text-xs text-slate-400 font-mono break-all">0xc299b0c6a6f91150bbe4d19ea1c7570ad8d62e90</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">PreSale Contract</h4>
                <p className="text-xs text-slate-400 font-mono break-all">0xa8bebf34a092405501e7eb606473e2b4189e42ff</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-blue-400" />
                Token Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Token Name</p>
                  <p className="text-white font-semibold">Launch Stream Token</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Symbol</p>
                  <p className="text-white font-semibold">LST</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Supply</p>
                  <p className="text-white font-semibold">1,000,000,000 LST</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Decimals</p>
                  <p className="text-white font-semibold">18</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Standard</p>
                  <p className="text-white font-semibold">ERC-20</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Network</p>
                  <p className="text-white font-semibold">Ethereum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Token Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Public Sale</span>
                  <span className="text-white font-semibold">40% (400M LST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Team & Advisors</span>
                  <span className="text-white font-semibold">20% (200M LST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Development Fund</span>
                  <span className="text-white font-semibold">15% (150M LST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Marketing & Partnerships</span>
                  <span className="text-white font-semibold">10% (100M LST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Liquidity Pool</span>
                  <span className="text-white font-semibold">10% (100M LST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Reserve Fund</span>
                  <span className="text-white font-semibold">5% (50M LST)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <Card className="mb-12 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Key Features & Utilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Platform Governance</h4>
                <p className="text-slate-400 text-sm">
                  LST holders can vote on platform upgrades, fee structures, and new feature implementations.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Fee Discounts</h4>
                <p className="text-slate-400 text-sm">
                  Holding LST provides up to 50% discount on all platform services including minting, sales, and locks.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Staking Rewards</h4>
                <p className="text-slate-400 text-sm">
                  Stake LST tokens to earn rewards from platform revenue sharing and additional yield farming
                  opportunities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Priority Access</h4>
                <p className="text-slate-400 text-sm">
                  LST holders get early access to new launches, exclusive presales, and premium platform features.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Revenue Sharing</h4>
                <p className="text-slate-400 text-sm">
                  A portion of platform fees are distributed to LST stakers, creating passive income opportunities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Burn Mechanism</h4>
                <p className="text-slate-400 text-sm">
                  Regular token burns from platform revenue help maintain deflationary pressure and token value.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vesting Schedule */}
        <Card className="mb-12 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              Vesting Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Team & Advisors (20%)</h4>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li>• 6-month cliff period</li>
                    <li>• 24-month linear vesting</li>
                    <li>• Monthly releases after cliff</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Development Fund (15%)</h4>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li>• 3-month cliff period</li>
                    <li>• 18-month linear vesting</li>
                    <li>• Quarterly releases</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <strong>Public Sale tokens</strong> are immediately available upon purchase with no vesting
                  restrictions.
                  <strong> Liquidity Pool tokens</strong> are locked for 12 months to ensure price stability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Development Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <Badge variant="secondary">Q4 2025</Badge>
                  <h4 className="font-semibold text-white">Foundation</h4>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Token launch</li>
                    <li>• Core platform features</li>
                    <li>• Community building</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <Badge variant="secondary">Q1 2026</Badge>
                  <h4 className="font-semibold text-white">Expansion</h4>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Multi-chain support</li>
                    <li>• Advanced analytics</li>
                    <li>• Partnership integrations</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <Badge variant="secondary">Q2 2026</Badge>
                  <h4 className="font-semibold text-white">Innovation</h4>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• DAO governance</li>
                    <li>• Yield farming</li>
                    <li>• Mobile app launch</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <Badge variant="secondary">Q3 2026</Badge>
                  <h4 className="font-semibold text-white">Ecosystem</h4>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Cross-chain bridges</li>
                    <li>• Enterprise solutions</li>
                    <li>• Global expansion</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
