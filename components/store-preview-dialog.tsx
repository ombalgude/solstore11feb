"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, AlertCircle, ShoppingBag, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SocialStats } from "@/components/social-stats"
import { ProductDeliveryPreview } from "@/components/product-delivery-preview"

interface StorePreviewProps {
  store: {
    id: string
    name: string
    username: string
    avatar: string
    coverImage: string
    bio: string
    rating: number
    badges: string[]
    products: {
      id: string
      title: string
      description: string
      price: number
      previewUrl: string
      previewVideoUrl?: string
      deliveryDetails?: {
        type: string
        format: string
        size: string
        includes: string[]
      }
      isLocked?: boolean
    }[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StorePreviewDialog({ store, open, onOpenChange }: StorePreviewProps) {
  // Add demo delivery details if not provided
  const firstProduct = {
    ...store.products[0],
    deliveryDetails: store.products[0].deliveryDetails || {
      type: "Instant Digital Download",
      format: "Multiple Formats",
      size: "250MB",
      includes: [
        "Source Files",
        "Documentation",
        "License Certificate",
        "Support & Updates"
      ]
    },
    isLocked: store.products[0].isLocked ?? true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogTitle className="sr-only">Store Preview: {store.name}</DialogTitle>
        <div className="relative">
          {/* Cover Image */}
          <div className="relative h-48">
            <Image
              src={store.coverImage}
              alt={store.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
          </div>

          {/* Top Bar with Preview Notice and Browse Button */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg flex items-center gap-2 flex-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">Preview Mode - Backend Integration Pending</span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              className="whitespace-nowrap shadow-lg hover:shadow-xl transition-shadow"
              asChild
            >
              <Link href="/marketplace" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Browse Marketplace
              </Link>
            </Button>
          </div>

          {/* Profile Section */}
          <div className="relative -mt-16 px-6">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-background">
                  <Image
                    src={store.avatar}
                    alt={`${store.name}'s profile picture`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Store Info */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{store.name}</h2>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-muted-foreground">@{store.username}</p>
                    <div className="flex items-center gap-1" aria-label={`Rating: ${store.rating.toFixed(1)} out of 3`}>
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Social Stats */}
                <div className="w-full max-w-lg">
                  <SocialStats username={store.username} />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2" aria-label="Store badges">
                  {store.badges.map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-muted-foreground">{store.bio}</p>
              </div>
            </Card>
          </div>

          {/* Products and Delivery Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Grid */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Popular Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {store.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={product.previewUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        {product.isLocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">{product.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{product.price} SOL</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Delivery Preview Sidebar */}
              <div className="lg:col-span-1">
                <ProductDeliveryPreview product={firstProduct} />
              </div>
            </div>

            {/* View Full Store Button */}
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                className="opacity-50 cursor-not-allowed"
                aria-disabled="true"
              >
                View Full Store (Demo)
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Full store view is disabled in preview mode
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}