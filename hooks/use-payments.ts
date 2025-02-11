import { useState } from 'react';
import { useToast } from './use-toast';
import { PaymentService } from '@/lib/services/payment-service';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from './use-wallet';

interface PhantomWindow extends Window {
  solana?: {
    connect: () => Promise<{ publicKey: PublicKey }>;
    signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
  }
}

declare const window: PhantomWindow;

export function usePayments() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { address } = useWallet();

  const processPayment = async (
    amount: number,
    recipientAddress: string,
    productId: string
  ) => {
    if (!window.solana || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Phantom wallet first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create a reference public key for tracking the transaction
      const reference = new PublicKey(productId);

      // Create the transaction
      const transaction = await PaymentService.createPaymentTransaction(
        amount,
        recipientAddress,
        reference,
        `Purchase of product ${productId}`
      );

      // Sign and send transaction
      const { signature } = await window.solana.signAndSendTransaction(transaction);

      // Wait for confirmation
      await PaymentService.confirmTransaction(signature);

      toast({
        title: "Payment successful",
        description: "Your transaction has been confirmed"
      });

      return signature;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading
  };
}