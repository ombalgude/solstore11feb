import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Bot, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center space-y-8 mb-16">
        <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          The Future of Digital Content
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          Create your own Solana-powered digital store in minutes. Sell your content with ease.
        </p>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 px-4 sm:px-0">
          <Button 
            asChild 
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/onboarding" className="group">
              <Bot className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
              Create Your Solana Store
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className="w-full sm:w-auto"
          >
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">AI-Powered Setup</h3>
          <p className="text-muted-foreground">
            Answer 3 simple questions and let our AI create your perfect store in seconds.
          </p>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Instant Payments</h3>
          <p className="text-muted-foreground">
            Get paid instantly with Solana's lightning-fast transactions.
          </p>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Secure Storage</h3>
          <p className="text-muted-foreground">
            Your content is stored securely and delivered instantly to buyers.
          </p>
        </Card>
      </div>
    </div>
  )
}