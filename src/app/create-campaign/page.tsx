"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, ArrowLeft, Upload, X, Eye, CheckCircle2 } from "lucide-react";
import { useContractStore } from '@/stores/contractsStore';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import Image from 'next/image';
import axios from 'axios';

const tags = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'environment', label: 'Environment', icon: '🌱' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'health', label: 'Medical / Health', icon: '🏥' },
  { value: 'arts', label: 'Arts & Culture', icon: '🎨' },
  { value: 'startups', label: 'Startups / Business', icon: '🚀' },
  { value: 'children', label: 'Child Welfare', icon: '👶' },
  { value: 'disaster', label: 'Disaster Relief / Emergency', icon: '🆘' },
  { value: 'research', label: 'Scientific Research', icon: '🔬' },
  { value: 'social', label: 'Women Empowerment / Social Justice', icon: '⚖️' },
];

const CreateCampaign = () => {
  const { connectWallet, createCampaign, isConnected, account, contract } = useContractStore();
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedtag, setSelectedtag] = useState('');
  const [currentContract, setCurrent] = useState<ethers.Contract>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    deadline: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setisLoading(true);
    e.preventDefault();
    if (!account || !image || !selectedtag) return;
    
    try {
      const tagData = tags.find(cat => cat.value === selectedtag);
      const data = {
        name: formData.title,
        description: formData.description,
        tag: tagData?.label || '',
      };
      const form = new FormData();
      form.append('file', image);
      form.append('data', JSON.stringify(data));
      const metadata: string = (await axios.post('/api/uploadmetadata', form)).data.data;
      
      await createCampaign(account, formData.title, metadata, formData.target, formData.deadline);
      
      // Reset form
      setFormData({ title: '', description: '', target: '', deadline: '' });
      setImage(null);
      setImagePreview('');
      setSelectedtag('');
      setisLoading(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setisLoading(false);
    }
  };

  const handleCreation = async (campaignId: string, owner: string, title: string) => {
    toast.success(`Campaign ${title} Created Successfully!`);
  };

  useEffect(() => {
    if (isConnected) {
      if (!contract) return;
      setCurrent(contract);
    }
  }, [isConnected, contract]);

  useEffect(() => {
    if (currentContract) {
      currentContract.on("CampaignCreated", handleCreation);
    }
    return () => {
      if (!currentContract) return;
      currentContract.removeListener("CampaignCreated", handleCreation);
    }
  }, [contract, currentContract]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/campaigns">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Explore Campaigns
              </Button>
            </Link>

            <Link href="/campaigns">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Eye className="w-4 h-4 mr-2" />
                All Campaigns
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Launch Your Campaign</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Turn your innovative ideas into funded reality. Provide the details below to start your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <Card className="max-w-md mx-auto border-border shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Connect Wallet</CardTitle>
                <CardDescription>
                  You need to connect your Web3 wallet to create and manage campaigns.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full py-6 text-lg rounded-xl font-bold"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Wallet Info */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Connected Wallet</span>
              </div>
              <span className="text-xs font-mono bg-background px-3 py-1 rounded-full border border-border">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Form Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Campaign Details
                  </CardTitle>
                  <CardDescription>Define your goals and tell your story</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Campaign Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. NextGen Solar Panels"
                        className="h-12 text-lg focus:ring-primary/20"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="target" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Goal Amount (ETH)</Label>
                      <Input
                        id="target"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-12 text-lg focus:ring-primary/20"
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Story</Label>
                    <textarea
                      id="description"
                      placeholder="Describe your project, why it matters, and how the funds will be used..."
                      className="w-full min-h-[160px] p-4 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {tags.map((tag) => (
                        <button
                          key={tag.value}
                          type="button"
                          onClick={() => setSelectedtag(tag.value)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                            selectedtag === tag.value
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]'
                              : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <span className="text-2xl mb-2">{tag.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-center">{tag.label}</span>
                          {selectedtag === tag.value && <CheckCircle2 className="w-3 h-3 mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Campaign Visual</Label>
                    {!imagePreview ? (
                      <div 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary hover:bg-muted/30 transition-all cursor-pointer group"
                      >
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-bold mb-1">Upload Cover Image</h4>
                        <p className="text-sm text-muted-foreground">PNG, JPG or GIF (max. 10MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                      </div>
                    ) : (
                      <div className="relative h-72 rounded-2xl overflow-hidden border border-border group">
                        <Image
                          src={imagePreview}
                          fill
                          alt="Campaign preview"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="rounded-full h-12 w-12"
                          >
                            <X className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="deadline" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Campaign Ends On</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      className="h-12 focus:ring-primary/20"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || !image || !selectedtag}
                  className="flex-1 py-8 text-xl font-bold rounded-2xl shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Publishing...' : 'Launch Campaign'}
                </Button>
                <Link href="/campaigns">
                  <Button variant="ghost" className="py-8 px-8 rounded-2xl">Cancel</Button>
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;