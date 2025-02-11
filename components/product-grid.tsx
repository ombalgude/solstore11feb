"use client"

import { memo, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Download, ShoppingCart, Star, Smartphone, Lock, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ProductRating } from "./product-rating"
import { useToast } from "@/hooks/use-toast"
import { ProductGalleryView } from "./product-gallery-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"
import { SharePaymentDialog } from "./share-payment-dialog"

const DEMO_PRODUCTS = [
  {
    id: "1",
    title: "Premium UI Kit",
    description: "Complete UI kit with 100+ components",
    price: 0.5,
    previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60",
    category: "design",
    averageRating: 2.5,
    isLocked: true,
    ratings: [
      { id: "1", rating: 3, comment: "Excellent quality!", reviewer: "Alice" },
      { id: "2", rating: 2, comment: "Good but could be better", reviewer: "Bob" }
    ]
  },
  {
    id: "2",
    title: "Stock Photo Collection",
    description: "100 high-quality stock photos",
    price: 0.3,
    previewUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60",
    category: "photography",
    averageRating: 3,
    isLocked: false,
    ratings: [
      { id: "3", rating: 3, comment: "Amazing collection!", reviewer: "Charlie" }
    ]
  },
  {
    id: "3",
    title: "3D Model Pack",
    description: "20 high-quality 3D models",
    price: 0.8,
    previewUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop&q=60",
    category: "3d",
    averageRating: 2,
    isLocked: true,
    ratings: [
      { id: "4", rating: 2, comment: "Good value for money", reviewer: "David" }
    ]
  },
  {
    id: "4",
    title: "Video Tutorial Bundle",
    description: "Complete video course collection",
    price: 1.2,
    previewUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60",
    category: "education",
    averageRating: 2.8,
    isLocked: true,
    ratings: [
      { id: "5", rating: 3, comment: "Very comprehensive!", reviewer: "Eve" }
    ]
  }
]

export function ProductGrid({ category = "all" }) {
  const { toast } = useToast()
  const { connect, address } = useWallet()
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [showGalleryView, setShowGalleryView] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [productToShare, setProductToShare] = useState<any>(null)

  const filteredProducts = useMemo(() => 
    category === "all" 
      ? products 
      : products.filter(product => product.category === category),
    [products, category]
  )

  const handleBuyClick = useCallback((product: any) => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive"
      })
      return
    }
    setSelectedProduct(product)
    setShowPaymentDialog(true)
  }, [address, toast])

  const handlePayment = async () => {
    if (!selectedProduct) return
    
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
        title: "Purchase successful!",
        description: "Your content has been unlocked.",
      })

      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === selectedProduct.id ? { ...p, isLocked: false } : p
        )
      )

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

  const handleRatingSubmit = useCallback(async (rating: number, comment: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(prev => 
        prev.map(product => {
          if (product.id === selectedProduct.id) {
            const newRating = {
              id: Date.now().toString(),
              rating,
              comment,
              reviewer: "You"
            }
            const newRatings = [...product.ratings, newRating]
            const averageRating = newRatings.reduce((acc, r) => acc + r.rating, 0) / newRatings.length
            
            return {
              ...product,
              ratings: newRatings,
              averageRating: Number(averageRating.toFixed(1))
            }
          }
          return product
        })
      )

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!"
      })
    } catch (error) {
      toast({
        title: "Error submitting rating",
        description: "Please try again later",
        variant: "destructive"
      })
    }
  }, [selectedProduct, toast])

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {category === "all" ? "Featured Products" : `${category.charAt(0).toUpperCase() + category.slice(1)} Products`}
        </h2>
        <Button 
          variant="outline"
          onClick={() => setShowGalleryView(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Smartphone className="w-4 h-4" />
          🤖 AI View
        </Button>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No products found in this category</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <AspectRatio ratio={16/9} className="relative">
                <Image
                  src={product.previewUrl}
                  alt={product.title}
                  fill
                  className={`object-cover transition-transform group-hover:scale-105 ${product.isLocked ? 'blur-[2px]' : ''}`}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {product.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-center space-y-2">
                      <Lock className="w-8 h-8 text-white mx-auto" />
                      <span className="text-white font-medium">Locked Content</span>
                    </div>
                  </div>
                )}
              </AspectRatio>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-mobile line-clamp-1">{product.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className={`w-4 h-4 ${product.averageRating >= 1 ? "fill-primary" : ""}`} />
                    <span className="text-sm font-medium">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{product.price} SOL</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setProductToShare(product)
                        setShowShareDialog(true)
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowRatingDialog(true)
                      }}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleBuyClick(product)}
                    >
                      {product.isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Unlock</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Buy Now</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {product.ratings.slice(-2).map((rating: any) => (
                    <div key={rating.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex shrink-0">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rating.rating ? "fill-primary" : ""}`}
                            />
                          ))}
                        </div>
                        <span className="font-medium truncate">{rating.reviewer}</span>
                      </div>
                      {rating.comment && (
                        <p className="text-muted-foreground ml-5 line-clamp-1">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>
              Pay with Solana to unlock this content instantly
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-lg font-bold">{selectedProduct?.price} SOL</span>
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
                "Processing Payment..."
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

      {selectedProduct && (
        <ProductRating
          productId={selectedProduct.id}
          productName={selectedProduct.title}
          open={showRatingDialog}
          onOpenChange={setShowRatingDialog}
          onRatingSubmit={handleRatingSubmit}
        />
      )}

      <ProductGalleryView
        open={showGalleryView}
        onClose={() => setShowGalleryView(false)}
        products={filteredProducts}
      />

      {productToShare && (
        <SharePaymentDialog
          product={productToShare}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}
    </>
  )
}