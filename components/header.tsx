"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { MobileNav } from "./mobile-nav"
import { useWeb3 } from "@/hooks/use-web3"
import { ChevronDown, User, LogOut, Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { isConnected, address, balance, isConnecting, connectWallet, disconnectWallet, currentNetwork } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Launch Stream" width={40} height={40} className="rounded-lg" />
          <span className="font-bold text-xl text-foreground">Launch Stream</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/presale" className="text-foreground hover:text-primary transition-colors">
            Presale
          </Link>
          <div className="relative group">
            <button className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
              Services
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/streamsmint" className="block px-4 py-2 text-card-foreground hover:bg-muted rounded-t-lg">
                StreamsMint
              </Link>
              <Link href="/streamssale" className="block px-4 py-2 text-card-foreground hover:bg-muted">
                StreamsSale
              </Link>
              <Link href="/streamslock" className="block px-4 py-2 text-card-foreground hover:bg-muted">
                StreamsLock
              </Link>
              <Link href="/streamsdrop" className="block px-4 py-2 text-card-foreground hover:bg-muted rounded-b-lg">
                StreamsDrop
              </Link>
            </div>
          </div>
          {isConnected && (
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Wallet Connection */}
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="hidden sm:inline">{formatAddress(address!)}</span>
                  <span className="sm:hidden">Wallet</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Connected to {currentNetwork?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {balance} {currentNetwork?.nativeCurrency.symbol}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              <span className="sm:hidden">Connect</span>
            </Button>
          )}

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
