"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ProductDeliveryPreview } from "@/components/product-delivery-preview"
import { ProductTracking } from "@/components/product-tracking"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { Star, ShoppingCart, Lock } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"

interface ProductPageProps {
  params: {
    username: string
    productId: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { toast } = useToast()
  const { connect, address } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)

  // Demo product data
  const product = {
    id: params.productId,
    title: "Premium UI Kit",
    description: "Complete UI kit with 100+ components",
    price: 0.5,
    previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60",
    previewVideoUrl: "https://example.com/preview.mp4",
    creator: {
      address: "abc123...",
      name: "Design Studio",
      username: params.username
    },
    rating: 2.8,
    deliveryDetails: {
      type: "Instant Digital Download",
      format: "Figma, Sketch, Adobe XD",
      size: "250MB",
      includes: [
        "100+ UI Components",
        "Design System Guide",
        "Documentation",
        "Free Updates",
        "Premium Support"
      ]
    },
    isLocked: true
  }

  const handlePurchase = async () => {
    if (!address) {
      await connect()
      return
    }

    setIsProcessing(true)
    try {
      // Here you would:
      // 1. Process payment
      // 2. Record purchase on blockchain
      // 3. Deliver product
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Purchase successful!",
        description: "Your content has been unlocked"
      })
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <AspectRatio ratio={16/9}>
              <Image
                src={product.previewUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.isLocked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Lock className="w-12 h-12 text-white mx-auto" />
                    <p className="text-white font-medium text-lg">
                      {product.price} SOL to Unlock
                    </p>
                    <Button 
                      onClick={handlePurchase}
                      disabled={isProcessing}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </div>
              )}
            </AspectRatio>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </Card>

          {/* Blockchain Tracking */}
          <ProductTracking 
            productId={product.id}
            creatorAddress={product.creator.address}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProductDeliveryPreview product={product} />
        </div>
      </div>

      {/* AI Support Widget */}
      <AIChatWidget productId={product.id} />
    </div>
  )
}