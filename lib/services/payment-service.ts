import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransaction } from '@solana/pay';

export class PaymentService {
  static async createPaymentTransaction(
    amount: number,
    recipientAddress: string,
    reference: PublicKey,
    memo?: string
  ) {
    try {
      // Connect to Solana devnet (change to mainnet-beta for production)
      const connection = new Connection('https://api.devnet.solana.com');
      const recipient = new PublicKey(recipientAddress);

      // Create transaction
      const tx = await createTransaction(connection, new PublicKey(recipientAddress), {
        reference,
        amount: amount * LAMPORTS_PER_SOL,
        memo,
      });

      return tx;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      throw error;
    }
  }

  static async confirmTransaction(signature: string) {
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const result = await connection.confirmTransaction(signature);
      return result;
    } catch (error) {
      console.error('Error confirming transaction:', error);
      throw error;
    }
  }
}