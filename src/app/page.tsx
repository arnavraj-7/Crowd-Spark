"use client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Clock, TrendingUp, Users, Coins, BookOpen, Globe, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useContractStore } from "@/stores/contractsStore";
import { motion } from "framer-motion";

const Index = () => {
  const { numberOfCampaigns } = useContractStore();

  const stats = [
    { icon: TrendingUp, label: "Total Raised", value: "$4.3M+", color: "text-emerald-500" },
    { icon: Users, label: "Active Campaigns", value: numberOfCampaigns || "240+", color: "text-blue-500" },
    { icon: Shield, label: "Success Rate", value: "92%", color: "text-indigo-500" },
  ];

  const features = [
    { icon: TrendingUp, title: "Create Campaigns", description: "Launch your crowdfunding campaign in minutes with our intuitive interface and global reach." },
    { icon: Users, title: "Smart Donations", description: "Secure, transparent donations powered by audited smart contracts on the Ethereum network." },
    { icon: Clock, title: "Deadline Management", description: "Automated deadline tracking with built-in trustless refund mechanisms if goals aren't met." },
    { icon: Shield, title: "Blockchain Security", description: "Immutable records and transparent fund management ensures 100% accountability for every wei." },
    { icon: Coins, title: "Web3 Payments", description: "Native Ethereum payments with low fees, zero intermediaries, and near-instant settlement." },
    { icon: BookOpen, title: "Learn & Grow", description: "Comprehensive resources to help you master blockchain fundraising and project management." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm font-semibold rounded-full border border-primary/20 bg-primary/5 text-primary">
              <Globe className="w-3.5 h-3.5 mr-2" />
              Decentralized Crowdfunding Protocol
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
              The future of <br />
              <span className="text-primary">fundraising</span> is here.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Transparent, secure, and trustless crowdfunding powered by Ethereum. Build the next big thing with a global community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
              <Link href="/create-campaign">
                <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl hover:shadow-primary/20 transition-all">
                  Launch Project
                  <Zap className="ml-2 h-5 w-5 fill-current" />
                </Button>
              </Link>
              
              <Link href="/campaigns">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl border-2">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>   
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-card border border-border p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-muted-foreground font-bold text-xs uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-50">
            * Stats above are simulation placeholders for this project prototype
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for scale. Built for trust.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Everything you need to launch and manage professional crowdfunding campaigns on the blockchain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border shadow-sm hover:shadow-lg transition-all rounded-3xl group">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-primary transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-4">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trustless Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-foreground text-background rounded-[48px] overflow-hidden p-8 md:p-20 relative">
            <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
              <Layers className="w-96 h-96" />
            </div>
            
            <div className="max-w-3xl relative z-10 space-y-12">
              <div className="space-y-6">
                <Badge variant="outline" className="border-background/20 text-background bg-background/5">How it works</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                  Smart contracts <br /> are your escrow.
                </h2>
                <p className="text-xl text-background/70 font-medium leading-relaxed">
                  Funds are never held by a central entity. They are secured by code on the Ethereum blockchain, ensuring creators get paid when goals are met, and backers are protected if they aren&apos;t.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-background/10">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">100% Accountable</h4>
                  <p className="text-sm text-background/60">Every transaction is visible on-chain for total transparency.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Automated Refunds</h4>
                  <p className="text-sm text-background/60">If a project fails to meet its goal, backers get their money back instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none">
            Join the decentralized <br /> funding revolution.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Start your campaign today and reach a global network of backers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/create-campaign">
              <Button size="lg" className="h-20 px-12 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-primary/30 transition-all active:scale-95">
                Launch My Project
              </Button>
            </Link>
            
            <Link href="/campaigns"> 
              <Button variant="outline" size="lg" className="h-20 px-12 text-2xl font-black rounded-3xl border-2">
                See Live Stats
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
