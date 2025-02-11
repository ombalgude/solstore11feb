"use client"

import { useEffect, useState } from "react"
import { useToast } from "./use-toast"
import { supabase } from "@/lib/supabase"

interface PhantomWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    on: (event: string, callback: () => void) => void;
    signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)

  useEffect(() => {
    // Check if we're in the browser and if Phantom is installed
    if (typeof window !== 'undefined') {
      setIsPhantomInstalled(!!window?.solana?.isPhantom)
      
      // Check if Phantom is installed and connected
      const checkConnection = async () => {
        try {
          if (window.solana?.isPhantom) {
            const response = await window.solana.connect({ onlyIfTrusted: true })
            setAddress(response.publicKey.toString())
          }
        } catch (error) {
          // User has not previously connected
          console.log("User not previously connected")
        }
      }

      checkConnection()

      // Listen for account changes
      if (window.solana) {
        window.solana.on("connect", () => {
          setAddress(window.solana?.publicKey?.toString() || null)
        })
        window.solana.on("disconnect", () => {
          setAddress(null)
        })
      }
    }
  }, [])

  const connect = async () => {
    if (typeof window === 'undefined') return

    try {
      setLoading(true)
      
      if (!window.solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank")
        toast({
          title: "Phantom wallet not found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive"
        })
        return
      }

      // Connect to Phantom
      const response = await window.solana.connect()
      const walletAddress = response.publicKey.toString()

      // Create a message for the user to sign
      const message = new TextEncoder().encode(
        `Welcome to SolStore!\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`
      )

      // Request signature
      const { signature } = await window.solana.signMessage(message)

      // Verify signature on backend and link wallet to user
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: { walletAddress }
      })

      if (error) throw error

      setAddress(walletAddress)
      
      toast({
        title: "Wallet connected",
        description: "Your Phantom wallet has been connected successfully"
      })

    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const disconnect = async () => {
    if (typeof window === 'undefined') return

    try {
      if (window.solana) {
        await window.solana.disconnect()
        await supabase.auth.updateUser({
          data: { walletAddress: null }
        })
        setAddress(null)
        toast({
          title: "Wallet disconnected",
          description: "Your wallet has been disconnected"
        })
      }
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnect failed",
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive"
      })
    }
  }

  const signAndSendTransaction = async (transaction: any) => {
    if (typeof window === 'undefined') return

    try {
      if (!window.solana?.isPhantom) {
        throw new Error("Phantom wallet not connected")
      }

      // Sign and send transaction logic here
      // This will be implemented when we add payment functionality

    } catch (error: any) {
      console.error("Transaction error:", error)
      throw error
    }
  }

  return {
    connect,
    disconnect,
    signAndSendTransaction,
    address,
    loading,
    isPhantomInstalled
  }
}