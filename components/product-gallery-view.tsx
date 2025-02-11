"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart, Heart, X, Star, Lock, Bot, Sparkles, Scan, Zap } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface Product {
  id: string
  title: string
  description: string
  price: number
  previewUrl: string
  averageRating: number
  isLocked?: boolean
}

interface ProductGalleryViewProps {
  open: boolean
  onClose: () => void
  products: Product[]
}

export function ProductGalleryView({ open, onClose, products }: ProductGalleryViewProps) {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([])
  const [showRobot, setShowRobot] = useState(true)
  const [robotPulse, setRobotPulse] = useState(false)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [showScanEffect, setShowScanEffect] = useState(false)

  useEffect(() => {
    if (open) {
      const shuffled = [...products]
        .sort(() => Math.random() - 0.5)
        .filter((product, index, self) => 
          index === self.findIndex((p) => p.id === product.id)
        )
      setShuffledProducts(shuffled)
      setCurrentIndex(0)
      setShowRobot(true)
    }
  }, [open, products])

  const handleRobotClick = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setRobotPulse(true)
    setShowScanEffect(true)

    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowScanEffect(false)
    setShowRobot(false)

    await new Promise(resolve => setTimeout(resolve, 300))
    if (currentIndex < shuffledProducts.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setCurrentIndex(0)
    }

    await new Promise(resolve => setTimeout(resolve, 300))
    setShowRobot(true)
    setRobotPulse(false)
    setIsAnimating(false)
  }

  const handleLike = (productId: string) => {
    setLiked(prev => ({ ...prev, [productId]: !prev[productId] }))
    toast({
      title: liked[productId] ? "Removed from favorites" : "Added to favorites",
      duration: 1500
    })
  }

  const handleBuy = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart"
    })
  }

  if (!open || shuffledProducts.length === 0) return null

  const currentProduct = shuffledProducts[currentIndex]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-[100vh] p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>AI Product Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="relative h-full overflow-hidden bg-black">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="relative h-full"
            >
              <div className="relative h-full">
                <Image
                  src={currentProduct.previewUrl}
                  alt={currentProduct.title}
                  fill
                  className="object-cover"
                  priority
                />
                {currentProduct.isLocked && (
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
                )}

                {showScanEffect && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-primary/50"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                )}
              </div>

              <AnimatePresence mode="wait">
                {showRobot && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={robotPulse ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                      onClick={handleRobotClick}
                      className="w-32 h-32 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer border-2 border-primary shadow-lg shadow-primary/20 relative group"
                      disabled={isAnimating}
                      aria-label="Show next product"
                    >
                      <div className="absolute inset-0 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                      <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse" />
                      <div className="relative flex items-center justify-center">
                        <Bot className="w-16 h-16 text-primary z-10" />
                        <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                        <Zap className="w-6 h-6 text-primary absolute -bottom-2 -left-2 animate-pulse" />
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-md bg-black/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{currentProduct.title}</h2>
                      <p className="text-white/80 mb-2">{currentProduct.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">
                          {currentProduct.price} SOL
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${currentProduct.averageRating >= 1 ? "fill-primary" : ""}`} />
                          <span className="text-sm">{currentProduct.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/10 hover:bg-white/20"
                        onClick={() => handleLike(currentProduct.id)}
                        aria-label={liked[currentProduct.id] ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart 
                          className={`h-6 w-6 ${liked[currentProduct.id] ? "fill-red-500 text-red-500" : "text-white"}`} 
                        />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleBuy(currentProduct.id)}
                        aria-label={currentProduct.isLocked ? "Unlock product" : "Add to cart"}
                      >
                        {currentProduct.isLocked ? (
                          <Lock className="h-6 w-6" />
                        ) : (
                          <ShoppingCart className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-4 left-4 right-4 flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={shuffledProducts.length} aria-valuenow={currentIndex + 1}>
                {shuffledProducts.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-primary shadow-lg shadow-primary/50" 
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white/50 text-center font-mono"
              >
                Tap AI to discover more
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}