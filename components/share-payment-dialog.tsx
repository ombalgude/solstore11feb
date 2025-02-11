"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generatePaymentLink } from "@/lib/utils/payment-links"

interface SharePaymentDialogProps {
  product: {
    id: string
    title: string
    price: number
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SharePaymentDialog({ product, open, onOpenChange }: SharePaymentDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const paymentLink = generatePaymentLink(
    product.id,
    product.price,
    product.title
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Link copied!",
        description: "Payment link copied to clipboard"
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually",
        variant: "destructive"
      })
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Buy ${product.title} for ${product.price} SOL`,
          url: paymentLink
        })
      } else {
        handleCopy()
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Payment Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Link</label>
            <div className="flex gap-2">
              <Input 
                value={paymentLink} 
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}