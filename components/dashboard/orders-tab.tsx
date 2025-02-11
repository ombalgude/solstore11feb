"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label" // Add Label import
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Download, Loader2, Store } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Purchase {
  id: string
  productTitle: string
  seller: string
  price: number
  status: "pending" | "completed" | "reported"
  createdAt: string
  reportReason?: string
}

export function OrdersTab() {
  const { toast } = useToast()
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Demo data - in a real app, fetch from API
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: "1",
      productTitle: "Premium UI Kit",
      seller: "designstudio",
      price: 2.5,
      status: "pending",
      createdAt: "2024-02-04T10:00:00Z"
    },
    {
      id: "2",
      productTitle: "Stock Photo Collection",
      seller: "photopro",
      price: 1.2,
      status: "completed",
      createdAt: "2024-02-03T15:30:00Z"
    }
  ])

  const handleReport = async () => {
    if (!selectedPurchase) return
    if (!reportReason.trim()) {
      toast({
        title: "Report reason required",
        description: "Please explain why you're reporting this purchase",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Here you would make an API call to report the purchase
      const response = await fetch("/api/report-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: selectedPurchase.id,
          reason: reportReason
        })
      })

      if (!response.ok) throw new Error("Failed to submit report")

      // Update local state
      setPurchases(prev => prev.map(p => 
        p.id === selectedPurchase.id 
          ? { ...p, status: "reported", reportReason } 
          : p
      ))

      toast({
        title: "Report submitted",
        description: "We'll investigate and get back to you soon"
      })

      setShowReportDialog(false)
      setReportReason("")
      setSelectedPurchase(null)
    } catch (error) {
      toast({
        title: "Error submitting report",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: Purchase["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "reported":
        return <Badge variant="destructive">Reported</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Orders</h2>
        <p className="text-muted-foreground">
          Track and manage your purchases
        </p>
      </div>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{purchase.productTitle}</h3>
                  {getStatusBadge(purchase.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Seller: {purchase.seller} • {purchase.price} SOL
                </p>
                <p className="text-xs text-muted-foreground">
                  Order ID: #{purchase.id} • {new Date(purchase.createdAt).toLocaleDateString()}
                </p>
                {purchase.reportReason && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Purchase Reported</AlertTitle>
                    <AlertDescription>{purchase.reportReason}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex items-center gap-4">
                {purchase.status === "pending" && (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setSelectedPurchase(purchase)
                      setShowReportDialog(true)
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Purchase</DialogTitle>
            <DialogDescription>
              Let us know why you're reporting this purchase. This will notify our team and the seller.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Reporting a purchase will temporarily freeze the seller's store until the issue is resolved.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason for Report</Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Explain why you haven't received your purchase..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReportDialog(false)
                  setReportReason("")
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReport}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}