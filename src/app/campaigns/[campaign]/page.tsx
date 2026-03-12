"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Wallet,
  Users,
  Share2,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { useContractStore } from "@/stores/contractsStore";
import type { ProcessedCampaign } from "@/types/index.ts";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const tagIcons: Record<string, string> = {
  "Technology": "💻",
  "Environment": "🌱",
  "Education": "📚",
  "Health": "🏥",
  "Art": "🎨",
  "Arts & Culture": "🎨",
  "Startups / Business": "🚀",
  "Child Welfare": "👶",
  "Disaster Relief / Emergency": "🆘",
  "Scientific Research": "🔬",
  "Women Empowerment / Social Justice": "⚖️",
};

const CampaignDetail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const campaignId = params?.campaign;
  const { allCampaigns, isfetching, isConnected, connectWallet, donate, getAllCampaigns } = useContractStore();
  const [currentCampaign, setCurrent] = useState<ProcessedCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    if (allCampaigns === null) return;
    const isCurrent = allCampaigns.find((camp: ProcessedCampaign) => camp.id === Number(campaignId));
    if (!isCurrent) return;
    setCurrent(isCurrent);
  }, [allCampaigns, campaignId]);

  const formatDeadline = (deadlineDate: Date) => {
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Ends today";
    return `${diffDays} days left`;
  };

  const getProgressPercentage = (donated: string, target: string) => {
    return Math.min(((parseFloat(donated) / parseFloat(target)) * 100), 100);
  };

  const handleDonate = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    if (!currentCampaign || !donationAmount) return;
    setIsLoading(true);
    try {
      await donate(Number(currentCampaign.id), donationAmount);
      toast.success(`Donation of ${donationAmount} ETH made successfully!`);
      setDonationAmount("");
      getAllCampaigns();
    } catch (error: any) {
      toast.error(error.message || "Donation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isfetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!currentCampaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Campaign Not Found</h2>
          <Button onClick={() => router.push("/campaigns")} variant="outline">
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const progress = getProgressPercentage(currentCampaign.amountCollected, currentCampaign.target);
  const isEnded = new Date(currentCampaign.deadlineDate) < new Date();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-40 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/campaigns")}
              className="text-muted-foreground hover:text-foreground group -ml-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              All Projects
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-8">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted">
                <Image
                  fill
                  src={currentCampaign.imageUrl}
                  alt={currentCampaign.title}
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 left-6">
                  <Badge variant="secondary" className="backdrop-blur-md bg-background/90 border-none px-4 py-1.5 font-bold shadow-lg">
                    {tagIcons[currentCampaign.tag || ""] || "📁"} {currentCampaign.tag}
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">{currentCampaign.title}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Campaign Creator</span>
                      <span className="font-mono text-sm font-semibold">{currentCampaign.owner.slice(0, 8)}...{currentCampaign.owner.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground px-4 py-2 bg-muted/30 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Launched on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <h2 className="text-3xl font-bold">About the project</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-xl leading-relaxed text-muted-foreground whitespace-pre-line">
                  {currentCampaign.description || "No description provided for this campaign."}
                </p>
              </div>

              <Card className="border-border bg-card shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <ExternalLink className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">Project Metadata</h3>
                      <p className="text-sm text-muted-foreground">All project information is stored permanently on the decentralized web (IPFS).</p>
                    </div>
                  </div>
                  <Link
                    href={currentCampaign.metadata}
                    target="_blank"
                    className="block p-4 bg-muted/50 rounded-2xl font-mono text-xs text-primary hover:bg-muted transition-colors break-all"
                  >
                    {currentCampaign.metadata}
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-border shadow-2xl rounded-[32px] sticky top-24 overflow-hidden bg-card">
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter">{currentCampaign.amountCollected}</span>
                    <span className="text-2xl font-bold text-muted-foreground">ETH</span>
                  </div>
                  <div className="space-y-4">
                    <Progress value={progress} className="h-4 rounded-full" />
                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                      <span className="text-muted-foreground">Goal: {currentCampaign.target} ETH</span>
                      <span className="text-primary">{progress.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-muted/30 rounded-3xl border border-border text-center space-y-1">
                    <div className="text-3xl font-black">{currentCampaign.donators.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Backers</div>
                  </div>
                  <div className="p-5 bg-muted/30 rounded-3xl border border-border text-center space-y-1">
                    <div className={`text-3xl font-black ${isEnded ? "text-destructive" : "text-emerald-500"}`}>
                      {formatDeadline(new Date(currentCampaign.deadlineDate)).split(' ')[0]}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Days Left</div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full h-20 text-xl font-black rounded-3xl shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98]"
                      disabled={isEnded || isLoading}
                    >
                      {isEnded ? "Campaign Ended" : "Back This Project"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md border-border bg-card rounded-[32px]">
                    <DialogHeader className="space-y-4 p-4">
                      <DialogTitle className="text-3xl font-black tracking-tight">Support project</DialogTitle>
                      <DialogDescription className="text-base">
                        Your contribution helps bring this project to life.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-8 p-4 pt-0">
                      <div className="space-y-4">
                        <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Contribution Amount
                        </Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.1"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="h-20 text-3xl font-black pl-6 pr-20 rounded-2xl focus:ring-primary/20 border-2"
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground text-xl">ETH</div>
                        </div>
                      </div>
                      <Button
                        onClick={handleDonate}
                        className="w-full h-16 text-xl font-black rounded-2xl"
                        disabled={!donationAmount || isLoading}
                      >
                        {!isConnected ? "Connect Wallet" : `Pledge ${donationAmount || "0"} ETH`}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Smart Contract</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/20 px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Recent Backers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 px-8">
                {currentCampaign.donators.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <p className="font-bold text-muted-foreground">No backers yet.</p>
                    <p className="text-xs text-muted-foreground">Be the first to pledge support!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 py-4">
                    {currentCampaign.donators.map((donator, index) => (
                      <div key={index} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-xs font-black border border-border group-hover:border-primary/50 transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[10px] font-bold text-muted-foreground truncate group-hover:text-foreground transition-colors">
                            {donator}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Verified Supporter</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;