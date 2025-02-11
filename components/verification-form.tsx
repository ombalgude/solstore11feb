"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, FileText, Globe, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface VerificationFormProps {
  onVerificationSubmitted: () => void
}

export function VerificationForm({ onVerificationSubmitted }: VerificationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    businessWebsite: "",
    businessDescription: "",
    idType: "",
    idNumber: "",
    idDocument: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, first upload the ID document to secure storage
      // and get back a secure URL
      const idDocumentUrl = "https://example.com/secure-document-url"

      const response = await fetch("/api/verify-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessWebsite: formData.businessWebsite,
          businessDescription: formData.businessDescription,
          idDocumentUrl,
          idType: formData.idType,
          idNumber: formData.idNumber
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast({
        title: "Verification submitted",
        description: "Your verification request is being reviewed"
      })

      onVerificationSubmitted()
    } catch (error: any) {
      toast({
        title: "Error submitting verification",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Creator Verification</h2>
          <p className="text-muted-foreground">
            Complete this form to become a verified seller on SolStore
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You must be at least 18 years old and provide valid identification to become a verified seller.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Business Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter your business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessWebsite">Business Website</Label>
              <Input
                id="businessWebsite"
                type="url"
                value={formData.businessWebsite}
                onChange={(e) => setFormData(prev => ({ ...prev, businessWebsite: e.target.value }))}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                placeholder="Describe your business and what you plan to sell"
                required
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Identity Verification
            </h3>

            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select
                value={formData.idType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, idType: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                placeholder="Enter your ID number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idDocument">Upload ID Document</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="idDocument"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    idDocument: e.target.files?.[0] || null 
                  }))}
                  required
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={!formData.idDocument}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a clear photo or scan of your ID document
              </p>
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <p className="text-sm text-muted-foreground">
              By submitting this form, you confirm that:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You are at least 18 years old</li>
                <li>The information provided is accurate and truthful</li>
                <li>You agree to our terms of service and seller guidelines</li>
              </ul>
            </p>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Verification...
                </>
              ) : (
                "Submit Verification"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}