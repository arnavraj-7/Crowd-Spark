"use client";
import { Zap, Github, Mail, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-card border-t border-border mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2 group w-fit">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center transition-transform group-hover:scale-105">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">CrowdSpark</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              A decentralized crowdfunding prototype built to demonstrate the power of 
              Ethereum smart contracts and transparent fundraising. This is a personal 
              portfolio project and not a public financial platform.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/arnavraj-7/" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted rounded-lg">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="mailto:arnavrajcodes@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted rounded-lg">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-muted-foreground">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/campaigns" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Browse Campaigns</Link>
              </li>
              <li>
                <Link href="/create-campaign" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Launch Project</Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-muted-foreground">Technical Specs</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-medium text-muted-foreground">
                <Globe className="w-4 h-4 mr-2 text-primary/60" />
                Sepolia Testnet
              </li>
              <li className="flex items-center text-sm font-medium text-muted-foreground">
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                Verified Contracts
              </li>
              <li className="flex items-center text-sm font-medium text-muted-foreground">
                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                On-chain Logic
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            © {currentYear} CrowdSpark • Portfolio Prototype by Arnav Raj
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Personal Project / No Commercial Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;