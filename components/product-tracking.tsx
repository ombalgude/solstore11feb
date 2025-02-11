"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlockchainService } from "@/lib/services/blockchain-service"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Clock, FileCheck, Link, Loader2, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProductTrackingProps {
  productId: string
  creatorAddress: string
}

interface TrackingStep {
  status: 'created' | 'purchased' | 'delivered'
  timestamp: number
  hash: string
  verified: boolean
}

export function ProductTracking({ productId, creatorAddress }: ProductTrackingProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([])
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    loadProductHistory()
  }, [productId])

  const loadProductHistory = async () => {
    try {
      setLoading(true)
      const history = await BlockchainService.getProductHistory(productId)
      const isAuthentic = BlockchainService.verifyProductAuthenticity(history)

      setTrackingSteps(
        history.map(step => ({
          status: step.status,
          timestamp: step.timestamp,
          hash: step.hash,
          verified: isAuthentic
        }))
      )

      setIsVerified(isAuthentic)
    } catch (error) {
      console.error('Error loading product history:', error)
      toast({
        title: "Error loading tracking data",
        description: "Failed to load product history from blockchain",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStepIcon = (status: TrackingStep['status']) => {
    switch (status) {
      case 'created':
        return FileCheck
      case 'purchased':
        return Clock
      case 'delivered':
        return CheckCircle2
      default:
        return FileCheck
    }
  }

  const getStepTitle = (status: TrackingStep['status']) => {
    switch (status) {
      case 'created':
        return 'Product Created'
      case 'purchased':
        return 'Purchase Verified'
      case 'delivered':
        return 'Delivery Confirmed'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Link className="w-5 h-5" />
            Blockchain Verification
          </h3>
          <Badge 
            variant={isVerified ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            {isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {trackingSteps.map((step, index) => {
              const StepIcon = getStepIcon(step.status)
              return (
                <motion.div
                  key={step.hash}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      step.verified ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}>
                      <StepIcon className={`w-5 h-5 ${
                        step.verified ? 'text-primary' : 'text-destructive'
                      }`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{getStepTitle(step.status)}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground break-all">
                        {step.hash}
                      </p>
                    </div>
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className="ml-6 my-2 border-l-2 h-4" />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={loadProductHistory}
          >
            <Link className="w-4 h-4 mr-2" />
            Verify on Blockchain
          </Button>
        </div>
      </div>
    </Card>
  )
}