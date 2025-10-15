"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useWeb3 } from "@/hooks/use-web3"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isConnected } = useWeb3()

  const closeNav = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link href="/" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeNav}>
            Home
          </Link>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Services</p>
            <div className="pl-4 space-y-2">
              <Link
                href="/streamsmint"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={closeNav}
              >
                StreamsMint
              </Link>
              <Link
                href="/streamssale"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={closeNav}
              >
                StreamsSale
              </Link>
              <Link
                href="/streamslock"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={closeNav}
              >
                StreamsLock
              </Link>
              <Link
                href="/streamsdrop"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={closeNav}
              >
                StreamsDrop
              </Link>
            </div>
          </div>

          {isConnected && (
            <Link
              href="/dashboard"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeNav}
            >
              Dashboard
            </Link>
          )}

          <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeNav}>
            About
          </Link>

          <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeNav}>
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
