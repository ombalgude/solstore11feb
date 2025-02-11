"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setIsSuccess(true)
      toast({
        title: "Reset instructions sent",
        description: "Check your email for password reset instructions"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset instructions",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card className="p-6">
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive reset instructions
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-green-500">
              Reset instructions have been sent to your email.
            </p>
            <p className="text-sm text-muted-foreground">
              Check your inbox and follow the instructions to reset your password.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Instructions...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>

            <div className="text-center">
              <Button variant="link" asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}