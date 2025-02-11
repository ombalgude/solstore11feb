"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Building2, CheckCircle2, Clock, FileText, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VerificationForm } from "@/components/verification-form"
import { Badge } from "@/components/ui/badge"

export function BusinessTab() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Demo data - in a real app, fetch from API
  const verificationStatus = {
    status: "pending", // "pending" | "approved" | "rejected"
    submittedAt: "2024-02-04T10:00:00Z",
    businessName: "Digital Design Studio",
    businessWebsite: "https://example.com",
    notes: "Verification in progress"
  }

  const renderVerificationStatus = () => {
    switch (verificationStatus.status) {
      case "approved":
        return (
          <Card className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Verified Creator</h2>
                <p className="text-muted-foreground">
                  Your business has been verified. You can now sell products on SolStore.
                </p>
              </div>
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between p-4 bg-secondary rounded-lg">
                  <span className="font-medium">Business Name</span>
                  <span>{verificationStatus.businessName}</span>
                </div>
                <div className="flex justify-between p-4 bg-secondary rounded-lg">
                  <span className="font-medium">Website</span>
                  <a 
                    href={verificationStatus.businessWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {verificationStatus.businessWebsite}
                  </a>
                </div>
              </div>
            </div>
          </Card>
        )

      case "pending":
        return (
          <Card className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">Verification Pending</h2>
                  <Badge variant="secondary">Under Review</Badge>
                </div>
                <p className="text-muted-foreground">
                  Your verification request is being reviewed. This process typically takes 1-2 business days.
                </p>
              </div>
              <div className="w-full max-w-md">
                <div className="flex justify-between p-4 bg-secondary rounded-lg">
                  <span className="font-medium">Submitted</span>
                  <span>{new Date(verificationStatus.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification in Progress</AlertTitle>
                <AlertDescription>
                  We'll notify you via email once your verification is complete.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        )

      case "rejected":
        return (
          <Card className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  {verificationStatus.notes}
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground">
                Please review the feedback and submit a new verification request.
              </p>
              <VerificationForm 
                onVerificationSubmitted={() => {
                  toast({
                    title: "Verification submitted",
                    description: "Your new verification request is being reviewed"
                  })
                }} 
              />
            </div>
          </Card>
        )

      default:
        return <VerificationForm onVerificationSubmitted={() => {
          toast({
            title: "Verification submitted",
            description: "Your verification request is being reviewed"
          })
        }} />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Details</h2>
        <p className="text-muted-foreground">
          Verify your business to start selling on SolStore
        </p>
      </div>

      {renderVerificationStatus()}
    </div>
  )
}