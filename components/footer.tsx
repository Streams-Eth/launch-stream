import Link from "next/link"
import Image from "next/image"
import { Twitter, Github, Instagram as Telegram, Diamond as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Launch Stream" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-lg">Launch Stream</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Leading decentralized launchpad and token services protocol for the next generation of DeFi projects.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Telegram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Discord className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <div className="space-y-2 text-sm">
              <Link href="/streamsmint" className="block text-muted-foreground hover:text-primary transition-colors">
                StreamsMint {/* renamed from LaunchMint */}
              </Link>
              <Link href="/streamssale" className="block text-muted-foreground hover:text-primary transition-colors">
                StreamsSale {/* renamed from LaunchSale */}
              </Link>
              <Link href="/streamslock" className="block text-muted-foreground hover:text-primary transition-colors">
                StreamsLock {/* renamed from LaunchLock */}
              </Link>
              <Link href="/streamsdrop" className="block text-muted-foreground hover:text-primary transition-colors">
                StreamsDrop {/* renamed from LaunchDrop */}
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/whitepaper" className="block text-muted-foreground hover:text-primary transition-colors">
                Whitepaper
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/security" className="block text-muted-foreground hover:text-primary transition-colors">
                Security
              </Link>
              <Link href="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Launch Stream. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Built with ❤️ for the DeFi community</p>
        </div>
      </div>
    </footer>
  )
}
