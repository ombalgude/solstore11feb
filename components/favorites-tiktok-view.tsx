"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
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
  isLocked?: boolean
}

interface FavoritesTikTokViewProps {
  open: boolean
  onClose: () => void
  products: Product[]
}

export function FavoritesTikTokView({ open, onClose, products }: FavoritesTikTokViewProps) {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([])
  const [showRobot, setShowRobot] = useState(true)
  const [robotPulse, setRobotPulse] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisText, setAnalysisText] = useState("")

  // Shuffle products when opening the view
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
      setShowAnalysis(false)
    }
  }, [open, products])

  const generateAnalysis = () => {
    const product = shuffledProducts[currentIndex]
    const analyses = [
      `Analyzing visual composition... Detecting premium design elements in ${product.title}`,
      `Scanning market trends... This product shows high engagement potential`,
      `Processing creative elements... Unique artistic signature detected`,
      `Evaluating user experience... Interface patterns align with current design paradigms`,
      `Calculating market position... Price point optimized for target demographic`
    ]
    return analyses[Math.floor(Math.random() * analyses.length)]
  }

  const handleRobotClick = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setRobotPulse(true)
    setShowAnalysis(true)
    setAnalysisText(generateAnalysis())

    // Cinematic analysis sequence
    await new Promise(resolve => setTimeout(resolve, 1500))
    setShowAnalysis(false)
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

  if (!open || shuffledProducts.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-[100vh] p-0 gap-0">
        <DialogTitle className="sr-only">AI Product Analysis</DialogTitle>
        <div className="relative h-full overflow-hidden bg-black">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <X className="h-6 h-6" />
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
              {/* Product Image with Scanning Effect */}
              <div className="relative h-full">
                <Image
                  src={shuffledProducts[currentIndex].previewUrl}
                  alt={shuffledProducts[currentIndex].title}
                  fill
                  className="object-cover"
                  priority
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showAnalysis ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Scanning Line Effect */}
                {showAnalysis && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-primary/50"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                  />
                )}
              </div>

              {/* AI Analysis Overlay */}
              <AnimatePresence>
                {showAnalysis && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  >
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center space-y-4"
                      >
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <Scan className="w-5 h-5 animate-pulse" />
                          <span className="font-mono">AI ANALYSIS IN PROGRESS</span>
                        </div>
                        <p className="text-white/90 font-mono text-sm">
                          {analysisText}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Robot Interface */}
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
                    >
                      {/* Glowing Effect */}
                      <div className="absolute inset-0 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                      
                      {/* Energy Rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse" />
                      
                      {/* AI Icon */}
                      <div className="relative flex items-center justify-center">
                        <Bot className="w-16 h-16 text-primary z-10" />
                        <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                        <Zap className="w-6 h-6 text-primary absolute -bottom-2 -left-2 animate-pulse" />
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Product Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-md bg-black/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{shuffledProducts[currentIndex].title}</h2>
                      <p className="text-white/80 mb-2">{shuffledProducts[currentIndex].description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">
                          {shuffledProducts[currentIndex].price} SOL
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Progress Indicator */}
              <div className="absolute top-4 left-4 right-4 flex gap-1">
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

              {/* Interaction Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white/50 text-center font-mono"
              >
                Activate AI Analysis
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}