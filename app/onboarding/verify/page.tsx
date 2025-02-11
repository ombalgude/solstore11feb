"use client"

import { useState } from "react"
import { VerificationForm } from "@/components/verification-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

export default function VerifyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (isSubmitted) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Verification Pending</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your verification request has been submitted and is being reviewed. This process typically takes 1-2 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <VerificationForm onVerificationSubmitted={() => setIsSubmitted(true)} />
    </div>
  )
}