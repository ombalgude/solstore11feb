"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { decodePaymentLink } from "@/lib/utils/payment-links"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface PaymentPageProps {
  params: {
    params: string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { toast } = useToast()
  const { connect, address } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    const details = decodePaymentLink(params.params)
    if (!details) {
      toast({
        title: "Invalid payment link",
        description: "This payment link is invalid or has expired",
        variant: "destructive"
      })
      return
    }
    setPaymentDetails(details)
  }, [params.params, toast])

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

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Payment successful!",
        description: "Your content has been unlocked."
      })

      // Redirect to product page or show success state
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

  if (!paymentDetails) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-16">
        <Card className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading payment details...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-16">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{paymentDetails.title}</h1>
            <p className="text-muted-foreground">
              Complete your purchase using Phantom wallet
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Amount</span>
              <span className="text-lg font-bold">{paymentDetails.price} SOL</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Network Fee</span>
              <span>~0.000005 SOL</span>
            </div>
          </div>

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
                {address ? "Pay with Phantom" : "Connect Phantom Wallet"}
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Powered by Phantom & Solana Pay
          </div>
        </div>
      </Card>
    </div>
  )
}