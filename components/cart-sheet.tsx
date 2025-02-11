"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  previewUrl: string
}

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "Premium UI Kit",
      price: 0.5,
      quantity: 1,
      previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&auto=format&fit=crop&q=60"
    }
  ])

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart"
    })
  }

  const checkout = async () => {
    try {
      toast({
        title: "Processing payment",
        description: "Please confirm the transaction in your wallet"
      })
      // Implement Solana Pay integration here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      })
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Start adding some items to your cart!
              </p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src={item.previewUrl}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.price} SOL
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{total.toFixed(2)} SOL</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={checkout}
                  aria-label={`Checkout with Phantom - Total: ${total.toFixed(2)} SOL`}
                >
                  Checkout with Phantom
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}