"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Bot, Loader2, Rocket as RocketLaunch, Store } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function OnboardingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [showAI, setShowAI] = useState(true)
  const [questions, setQuestions] = useState({
    q1: "",
    q2: "",
    q3: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [storeData, setStoreData] = useState({
    name: "",
    username: "",
    bio: "",
    storeType: "",
    targetAudience: "",
  })

  const handleAISubmit = async () => {
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Set demo store data
      setStoreData({
        name: "Digital Creators Hub",
        username: "digitalcreators",
        bio: "A curated marketplace for premium digital content",
        storeType: questions.q1,
        targetAudience: questions.q2,
      })
      
      setShowAI(false)
    } catch (error) {
      toast({
        title: "Error analyzing responses",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCreateStore = async () => {
    setIsCreating(true)
    try {
      // Simulate store creation delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Store created successfully!",
        description: "Redirecting to your store...",
      })
      
      router.push(`/${storeData.username}`)
    } catch (error: any) {
      toast({
        title: "Error creating store",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Dialog open={showAI} onOpenChange={setShowAI}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className="text-2xl font-bold text-center">
            Let's Create Your Store
          </DialogTitle>
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
            </div>
            <p className="text-center text-muted-foreground">
              Answer these 3 questions to help us understand your business better
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What type of digital content will you be selling?
                </label>
                <Textarea
                  value={questions.q1}
                  onChange={(e) => setQuestions(prev => ({ ...prev, q1: e.target.value }))}
                  placeholder="e.g., Digital art, Photography, UI kits, Video tutorials..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Who is your target audience?
                </label>
                <Textarea
                  value={questions.q2}
                  onChange={(e) => setQuestions(prev => ({ ...prev, q2: e.target.value }))}
                  placeholder="e.g., Designers, Developers, Content creators..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What makes your content unique?
                </label>
                <Textarea
                  value={questions.q3}
                  onChange={(e) => setQuestions(prev => ({ ...prev, q3: e.target.value }))}
                  placeholder="e.g., Hand-crafted designs, Expert tutorials, Unique style..."
                />
              </div>
              <Button 
                className="w-full"
                onClick={handleAISubmit}
                disabled={isAnalyzing || !questions.q1 || !questions.q2 || !questions.q3}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RocketLaunch className="w-4 h-4 mr-2" />
                    Create Solana Store in Seconds
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!showAI && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Name</label>
                <Input
                  value={storeData.name}
                  onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your store name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">solstore.com/</span>
                  <Input
                    value={storeData.username}
                    onChange={(e) => setStoreData(prev => ({ 
                      ...prev, 
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    }))}
                    placeholder="your-username"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Only lowercase letters, numbers, and hyphens allowed
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Description</label>
                <Textarea
                  value={storeData.bio}
                  onChange={(e) => setStoreData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe your store and what you offer"
                />
              </div>
              <Button 
                className="w-full"
                onClick={handleCreateStore}
                disabled={isCreating || !storeData.name || !storeData.username || !storeData.bio}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 mr-2" />
                    Create Your Store
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}