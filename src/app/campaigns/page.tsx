"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Clock,
  ArrowLeft,
  Plus,
  Info,
  TrendingUp,
  Users,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { useContractStore } from "@/stores/contractsStore";
import type { ProcessedCampaign } from "@/types/index.ts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const tagIcons: Record<string, string> = {
  Technology: "💻",
  Environment: "🌱",
  Education: "📚",
  "Medical / Health": "🏥",
  "Arts & Culture": "🎨",
  "Startups / Business": "🚀",
  "Child Welfare": "👶",
  "Disaster Relief / Emergency": "🆘",
  "Scientific Research": "🔬",
  "Women Empowerment / Social Justice": "⚖️",
};

const Campaigns = () => {
  const router = useRouter();
  const [tag, setTag] = useState<string>("All");
  const { isLoading, connectWallet, getAllCampaigns, isConnected, allCampaigns, isfetching, sortedCampaigns } = useContractStore();
  const [taggedCampaigns, setTaggedCampaigns] = useState<ProcessedCampaign[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!isConnected) return;
      try {
        await getAllCampaigns();
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, [isConnected, getAllCampaigns]);

  const formatDeadline = (deadlineDate: Date) => {
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Ends today";
    return `${diffDays} days left`;
  };

  const getProgressPercentage = (donated: string, target: string) => {
    return Math.min((parseFloat(donated) / parseFloat(target)) * 100, 100);
  };

  if (isfetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Header Section */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wider uppercase">
                <TrendingUp className="w-4 h-4" />
                Live Crowdfunding
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Active Campaigns</h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Support innovative projects and help creators bring their ideas to life.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="hidden sm:flex"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={() => router.push("/create-campaign")}
                className="shadow-sm font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
            </div>
          </div>

          {/* Stats & Filters */}
          <div className="mt-12 flex flex-col md:flex-row items-center gap-6 justify-between border-t border-border pt-8">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{allCampaigns?.length || 0}</span>
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-widest">Total Projects</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-500">
                  {tag === "All" ? allCampaigns?.length || 0 : taggedCampaigns?.length || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-widest">
                  {tag === "All" ? "All Categories" : `${tag}`}
                </span>
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <select 
                className="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                name="tag" 
                defaultValue={"All"} 
                onChange={(e) => {
                  setTaggedCampaigns(sortedCampaigns[e.target.value] || []);
                  setTag(e.target.value);
                }}
              >
                <option value="All">🌟 All Categories</option>
                {Object.keys(tagIcons).map((tagName) => (
                  <option key={tagName} value={tagName}>
                    {tagIcons[tagName]} {tagName}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!isConnected ? (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect your wallet</h2>
            <p className="text-muted-foreground mb-8">Please connect your Web3 wallet to browse and support campaigns.</p>
            <Button onClick={connectWallet} className="w-full py-6 text-lg rounded-xl">
              Connect Wallet
            </Button>
          </div>
        ) : allCampaigns?.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground mb-8">Be the first to launch a campaign on CrowdSpark!</p>
            <Button onClick={() => router.push("/create-campaign")}>
              Create First Campaign
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {(tag === "All" ? allCampaigns : taggedCampaigns)?.map((campaign: ProcessedCampaign, index) => {
                const progress = getProgressPercentage(campaign.amountCollected, campaign.target);
                const isEnded = new Date(campaign.deadlineDate) < new Date();

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={campaign.id}
                  >
                    <Card className="group overflow-hidden border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col h-full">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={campaign.imageUrl}
                          alt={campaign.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="backdrop-blur-md bg-background/80 border-none px-3 py-1 font-semibold text-xs">
                            {tagIcons[campaign.tag || ""] || "📁"} {campaign.tag}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                              {campaign.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                              {campaign.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-end text-sm">
                              <span className="font-bold text-lg">{campaign.amountCollected} ETH</span>
                              <span className="text-muted-foreground font-medium">raised of {campaign.target} ETH</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
                              <span className={progress >= 100 ? "text-emerald-500" : "text-primary"}>
                                {progress.toFixed(0)}% Funded
                              </span>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className={isEnded ? "text-destructive" : ""}>
                                  {formatDeadline(new Date(campaign.deadlineDate))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-border">
                          <Link href={`/campaigns/${campaign.id}`} className="block">
                            <Button className="w-full group/btn" variant="secondary">
                              View Project
                              <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;