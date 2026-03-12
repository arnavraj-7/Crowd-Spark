"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { useContractStore } from "@/stores/contractsStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connectWallet, isConnected, addTestNet, correctChain } = useContractStore();
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Explore", href: "/campaigns" },
    { name: "Create", href: "/create-campaign" },
    { name: "About", href: "/#footer" },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">CrowdSpark</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                variant="ghost"
                key={item.name}
                onClick={() => router.push(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item.name}
              </Button>
            ))}
            
            <div className="h-6 w-px bg-border mx-2" />
            
            {!correctChain && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold"
                onClick={addTestNet}
              >
                Switch Network
              </Button>
            )}
            
            <Button
              size="sm"
              variant={isConnected ? "outline" : "default"}
              className={`font-semibold ${
                isConnected 
                  ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500" 
                  : ""
              }`}
              onClick={connectWallet}
              disabled={!correctChain || isConnected}
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-muted-foreground"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full font-semibold"
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

