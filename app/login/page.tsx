"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [showTutorial, setShowTutorial] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateUsername = (username: string) => {
    const re = /^[a-zA-Z0-9_-]{3,20}$/
    return re.test(username)
  }

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "Successfully logged in."
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async () => {
    // Validate all fields
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      })
      return
    }

    if (!validateUsername(formData.username)) {
      toast({
        title: "Invalid username",
        description: "Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens",
        variant: "destructive"
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      })
      return
    }

    if (!acceptedTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // First check if username is taken
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', formData.username)
        .single()

      if (existingUser) {
        throw new Error('Username already taken')
      }

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) throw signUpError

      if (!data.user) {
        throw new Error('Failed to create user')
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            username: formData.username,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

      if (profileError) {
        throw profileError
      }

      toast({
        title: "Account created!",
        description: "Welcome to SolStore. Let's set up your store."
      })
      router.push("/onboarding")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhantomLogin = async () => {
    setShowTutorial(true)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card className="p-6">
        <div className="text-center mb-6">
          <Wallet className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome to SolStore</h1>
          <p className="text-sm text-muted-foreground">
            Your gateway to premium digital content
          </p>
        </div>

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="px-0" asChild>
                  <Link href="/forgot-password">Forgot password?</Link>
                </Button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handlePhantomLogin}
            >
              <Image
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                alt="Solana"
                width={20}
                height={20}
                className="mr-2"
              />
              Continue with Phantom
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                3-20 characters, letters, numbers, underscores, and hyphens only
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                At least 6 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground"
              >
                I accept the{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm"
                  onClick={() => setShowTerms(true)}
                >
                  terms and conditions
                </Button>
              </label>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handlePhantomLogin}
            >
              <Image
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                alt="Solana"
                width={20}
                height={20}
                className="mr-2"
              />
              Continue with Phantom
            </Button>
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with Phantom Wallet</DialogTitle>
            <DialogDescription>
              Follow these steps to connect your Phantom wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Important</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure you have Phantom wallet installed and set up before proceeding.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">1. Install Phantom Wallet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you haven't already, install Phantom wallet from the official website.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open("https://phantom.app", "_blank")}
                >
                  Get Phantom Wallet
                </Button>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">2. Connect Your Wallet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Click below to connect your Phantom wallet to SolStore.
                </p>
                <Button className="w-full">
                  <Image
                    src="https://cryptologos.cc/logos/solana-sol-logo.png"
                    alt="Solana"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Connect Phantom
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {/* Terms content */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}