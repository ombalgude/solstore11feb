"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Check, Loader2, Star } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  name: string
  price: number
  features: PlanFeature[]
  recommended?: boolean
}

export function UpgradeTab() {
  const { toast } = useToast()
  const { connect, address } = useWallet()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const plans: Plan[] = [
    {
      name: "Free",
      price: 0,
      features: [
        { name: "Up to 2 products", included: true },
        { name: "Basic analytics", included: true },
        { name: "Standard support", included: true },
        { name: "Community features", included: true },
        { name: "Custom domain", included: false },
        { name: "Unlimited products", included: false },
        { name: "Priority support", included: false },
        { name: "Advanced analytics", included: false },
      ]
    },
    {
      name: "Pro",
      price: 10,
      recommended: true,
      features: [
        { name: "Up to 2 products", included: true },
        { name: "Basic analytics", included: true },
        { name: "Standard support", included: true },
        { name: "Community features", included: true },
        { name: "Custom domain", included: true },
        { name: "Unlimited products", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced analytics", included: true },
      ]
    },
    {
      name: "Enterprise",
      price: 50,
      features: [
        { name: "Up to 2 products", included: true },
        { name: "Basic analytics", included: true },
        { name: "Standard support", included: true },
        { name: "Community features", included: true },
        { name: "Custom domain", included: true },
        { name: "Unlimited products", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Custom integrations", included: true },
      ]
    }
  ]

  const handleUpgrade = async (plan: Plan) => {
    if (!address) {
      await connect()
      return
    }

    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  const processPayment = async () => {
    if (!selectedPlan) return

    setIsProcessing(true)
    try {
      // @ts-ignore
      const { solana } = window
      if (!solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank")
        return
      }

      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Upgrade successful!",
        description: `You've been upgraded to the ${selectedPlan.name} plan.`
      })
      setShowPaymentDialog(false)
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Upgrade Your Store</h2>
        <p className="text-muted-foreground">
          Choose the perfect plan to grow your digital content business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`p-6 relative ${
              plan.recommended ? "border-primary shadow-lg" : ""
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">SOL/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check
                    className={`w-4 h-4 ${
                      feature.included
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={
                      feature.included ? "" : "text-muted-foreground"
                    }
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.recommended ? "default" : "outline"}
              onClick={() => handleUpgrade(plan)}
            >
              {plan.price === 0 ? "Current Plan" : "Upgrade Now"}
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Upgrade your store with Solana Pay
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-lg font-bold">
                  {selectedPlan?.price} SOL/month
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Network Fee</span>
                <span>~0.000005 SOL</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={processPayment}
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

            <div className="text-center text-sm text-muted-foreground">
              Powered by Phantom & Solana Pay
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}