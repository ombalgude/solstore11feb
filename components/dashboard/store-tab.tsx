"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Bot, Globe, Loader2, Palette, Facebook, Github, Instagram, Link2, Linkedin, Twitter, Lock, Wallet, Check, AlertCircle, ChartBar, TrendingUp, Users, Star, Scan, Sparkles, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { motion, AnimatePresence } from "framer-motion"

interface StoreData {
  name: string
  username: string
  bio: string
  coverImage: string
  avatar: string
  theme: string
  isPaidPlan: boolean
  productCount: number
  socialLinks: {
    platform: string
    url: string
    icon: React.ComponentType<any>
  }[]
}

interface StoreAnalysis {
  title: string
  description: string
  icon: React.ComponentType<any>
  metrics: {
    label: string
    value: string
    change: number
  }[]
  recommendations: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
  }[]
}

export function StoreTab() {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [storeData, setStoreData] = useState<StoreData>({
    name: "Digital Creators Hub",
    username: "digitalcreators",
    bio: "A curated marketplace for premium digital content",
    coverImage: "https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?w=1200&auto=format&fit=crop&q=60",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
    theme: "default",
    isPaidPlan: false,
    productCount: 2,
    socialLinks: [
      { platform: "Twitter", url: "#", icon: Twitter },
      { platform: "Instagram", url: "#", icon: Instagram },
      { platform: "LinkedIn", url: "#", icon: Linkedin },
      { platform: "GitHub", url: "#", icon: Github }
    ]
  })

  const { connect, address } = useWallet()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<StoreAnalysis | null>(null)
  const [showScanEffect, setShowScanEffect] = useState(false)

  const handleAnalyzeStore = async () => {
    setIsAnalyzing(true)
    setShowAnalysis(true)
    setShowScanEffect(true)

    // Simulate AI analysis with a delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Demo analysis data
    setAnalysis({
      title: "Store Performance Analysis",
      description: "AI-powered insights based on market trends and top performers",
      icon: ChartBar,
      metrics: [
        {
          label: "Store Visibility",
          value: "68%",
          change: 15
        },
        {
          label: "Conversion Rate",
          value: "2.8%",
          change: -5
        },
        {
          label: "Engagement Score",
          value: "7.5/10",
          change: 12
        }
      ],
      recommendations: [
        {
          title: "Expand Product Catalog",
          description: "Top performers in your category average 8-12 products. Consider adding more items to increase visibility and sales potential.",
          priority: "high"
        },
        {
          title: "Optimize Pricing Strategy",
          description: "Your pricing is slightly below market average. Consider a 10-15% increase for premium items while maintaining competitive edge.",
          priority: "medium"
        },
        {
          title: "Enhance Product Descriptions",
          description: "Add more detailed descriptions with keywords to improve searchability and conversion rates.",
          priority: "high"
        },
        {
          title: "Implement Social Proof",
          description: "Add customer testimonials and ratings to build trust and credibility.",
          priority: "medium"
        },
        {
          title: "Content Schedule",
          description: "Engagement peaks during weekends. Schedule your product launches and updates accordingly.",
          priority: "low"
        }
      ]
    })

    setShowScanEffect(false)
    setIsAnalyzing(false)
  }

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Store updated successfully",
        description: "Your changes have been saved."
      })
    } catch (error) {
      toast({
        title: "Error updating store",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePayment = async () => {
    if (!address) {
      await connect()
      return
    }

    setIsProcessing(true)
    try {
      // @ts-ignore
      const { solana } = window
      if (!solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank")
        return
      }

      // Simulated payment for demo
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Payment successful!",
        description: "Your content has been unlocked.",
      })
      setShowPaymentDialog(false)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleShareStore = async () => {
    const storeUrl = `https://solstore.com/${storeData.username}`
    try {
      await navigator.clipboard.writeText(storeUrl)
      toast({
        title: "URL copied!",
        description: "Store link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy URL",
        description: "Please try copying manually",
        variant: "destructive"
      })
    }
  }

  const demoProduct = {
    title: "Premium Design Templates",
    description: "A collection of professional design templates",
    price: 2.5,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60"
  }

  return (
    <>
      <Tabs defaultValue="edit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="edit">Edit Store</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Store Details</h3>
                {!storeData.isPaidPlan && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    Free Plan: {storeData.productCount}/2 products used
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={storeData.name}
                    onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Store URL</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">solstore.com/</span>
                    <Input
                      id="username"
                      value={storeData.username}
                      onChange={(e) => setStoreData(prev => ({
                        ...prev,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      }))}
                      placeholder="your-username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Store Description</Label>
                  <Textarea
                    id="bio"
                    value={storeData.bio}
                    onChange={(e) => setStoreData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your store"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Store Appearance</h3>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Cover Image</Label>
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={storeData.coverImage}
                      alt="Store cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline">
                    Change Cover Image
                  </Button>
                </div>

                <div>
                  <Label className="mb-2 block">Profile Picture</Label>
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src={storeData.avatar}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline">
                    Change Profile Picture
                  </Button>
                </div>

                <div>
                  <Label className="mb-4 block">Store Theme</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["default", "minimal", "bold"].map((theme) => (
                      <Card
                        key={theme}
                        className={`p-4 cursor-pointer transition-all ${
                          storeData.theme === theme ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setStoreData(prev => ({ ...prev, theme }))}
                      >
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          <span className="capitalize">{theme}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Store Optimization</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Let AI analyze your store and suggest optimizations for better visibility and sales.
                  </p>
                </div>
                <Button onClick={handleAnalyzeStore} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Analyze Store
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="rounded-lg overflow-hidden border bg-card">
            <div className="relative h-64 md:h-80">
              <Image
                src={storeData.coverImage}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
              
              <div className="absolute top-4 right-4">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="shadow-lg hover:shadow-xl transition-shadow"
                  asChild
                >
                  <Link href="/marketplace" className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Browse Marketplace
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative -mt-20 px-6 pb-6">
              <Card className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-background">
                    <Image
                      src={storeData.avatar}
                      alt={storeData.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{storeData.name}</h1>
                    <p className="text-muted-foreground">@{storeData.username}</p>
                  </div>

                  <p className="max-w-lg text-lg">{storeData.bio}</p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {storeData.socialLinks.map((link) => (
                      <Button
                        key={link.platform}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <link.icon className="w-4 h-4 mr-2" />
                          {link.platform}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Featured Products</h2>
                  <Button 
                    variant="outline" 
                    onClick={handleShareStore}
                    className="flex items-center gap-2"
                  >
                    <Link2 className="w-4 h-4" />
                    Share Store
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="overflow-hidden group">
                    <div className="relative aspect-video">
                      <Image
                        src={demoProduct.image}
                        alt={demoProduct.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-2">
                            <Image
                              src="https://cryptologos.cc/logos/solana-sol-logo.png"
                              alt="Solana"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <Lock className="w-8 h-8 mx-auto text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{demoProduct.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{demoProduct.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{demoProduct.price} SOL</span>
                        <Button size="sm" onClick={() => setShowPaymentDialog(true)}>
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 flex items-center justify-center text-center h-[300px]">
                    <div className="text-muted-foreground">
                      <p className="mb-2">Add more products</p>
                      <p className="text-sm">Your products will appear here</p>
                    </div>
                  </Card>
                </div>

                {!storeData.isPaidPlan && (
                  <div className="fixed bottom-6 right-6 z-50">
                    <Button className="group relative overflow-hidden" asChild>
                      <Link href="/onboarding">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center gap-2">
                          <Image
                            src="https://cryptologos.cc/logos/solana-sol-logo.png"
                            alt="Solana"
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          Create Your SOL Store
                        </div>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Premium Content</DialogTitle>
            <DialogDescription>
              Pay with Solana to unlock this content instantly
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-lg font-bold">{demoProduct.price} SOL</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Network Fee</span>
                <span>~0.000005 SOL</span>
              </div>
            </div>

            {!address ? (
              <Button className="w-full" onClick={connect}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Phantom Wallet
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Image
                      src="https://cryptologos.cc/logos/solana-sol-logo.png"
                      alt="Solana"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    Pay with Phantom
                  </>
                )}
              </Button>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Powered by Phantom & Solana Pay
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Store Analysis
            </DialogTitle>
            <DialogDescription>
              Insights and recommendations based on market data
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            {showScanEffect && (
              <div className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-x-0 h-1 bg-primary/50"
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                />
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Scan className="w-12 h-12 text-primary mx-auto animate-pulse" />
                    <p className="text-sm text-muted-foreground">Analyzing store data...</p>
                  </div>
                </div>
              </div>
            )}

            {analysis && !showScanEffect && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {analysis.metrics.map((metric) => (
                    <Card key={metric.label} className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <div className={`flex items-center ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.change >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4 rotate-180" />
                            )}
                            <span className="text-sm ml-1">{Math.abs(metric.change)}%</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          recommendation.priority === 'high' 
                            ? 'bg-primary/10' 
                            : recommendation.priority === 'medium'
                            ? 'bg-secondary'
                            : 'bg-muted'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          recommendation.priority === 'high'
                            ? 'bg-primary/20'
                            : 'bg-secondary'
                        }`}>
                          <Star className={`w-4 h-4 ${
                            recommendation.priority === 'high' ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium mb-1">{recommendation.title}</p>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Bot className="w-4 h-4 mr-2" />
                    Analysis powered by AI
                  </div>
                  <Button onClick={() => setShowAnalysis(false)}>
                    Close Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}