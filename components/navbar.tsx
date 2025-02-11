"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Wallet, Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { CartSheet } from "@/components/cart-sheet"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const { connect, disconnect, address, loading } = useWallet()
  const [showCart, setShowCart] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Disconnect wallet if connected
      if (address) {
        await disconnect()
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Logged out successfully",
        description: "See you next time!"
      })

      // Close mobile menu if open
      setShowMobileMenu(false)
      
      // Redirect to home page
      router.push('/')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast({
        title: "Error logging out",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <span className="font-bold hidden sm:inline">SolStore</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/marketplace">Marketplace</Link>
          </Button>
          {address ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" onClick={() => setShowCart(true)}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button onClick={connect} disabled={loading}>
                Connect Wallet
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setShowMobileMenu(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Menu */}
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4">
                <span className="font-bold">Menu</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col space-y-4">
                <Button variant="ghost" asChild onClick={() => setShowMobileMenu(false)}>
                  <Link href="/marketplace">Marketplace</Link>
                </Button>
                {address ? (
                  <>
                    <Button variant="ghost" asChild onClick={() => setShowMobileMenu(false)}>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" onClick={() => {
                      setShowCart(true)
                      setShowMobileMenu(false)
                    }}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                    </Button>
                    <div className="pt-2 border-t">
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild onClick={() => setShowMobileMenu(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button onClick={() => {
                      connect()
                      setShowMobileMenu(false)
                    }} disabled={loading}>
                      Connect Wallet
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <CartSheet open={showCart} onOpenChange={setShowCart} />
    </nav>
  )
}