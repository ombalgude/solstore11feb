import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createHash } from 'crypto';

interface ProductTrackingData {
  id: string;
  timestamp: number;
  status: 'created' | 'purchased' | 'delivered';
  hash: string;
  previousHash: string;
}

export class BlockchainService {
  private static connection = new Connection('https://api.devnet.solana.com');

  static async recordProductCreation(
    productId: string,
    creatorAddress: string,
    metadata: any
  ) {
    try {
      const timestamp = Date.now();
      const hash = this.calculateHash(productId, timestamp, 'created', '');

      const trackingData: ProductTrackingData = {
        id: productId,
        timestamp,
        status: 'created',
        hash,
        previousHash: ''
      };

      // Create Solana transaction to store tracking data
      const transaction = await this.createTrackingTransaction(
        trackingData,
        creatorAddress
      );

      return { transaction, trackingData };
    } catch (error) {
      console.error('Error recording product creation:', error);
      throw error;
    }
  }

  static async recordProductPurchase(
    productId: string,
    buyerAddress: string,
    previousHash: string
  ) {
    try {
      const timestamp = Date.now();
      const hash = this.calculateHash(productId, timestamp, 'purchased', previousHash);

      const trackingData: ProductTrackingData = {
        id: productId,
        timestamp,
        status: 'purchased',
        hash,
        previousHash
      };

      const transaction = await this.createTrackingTransaction(
        trackingData,
        buyerAddress
      );

      return { transaction, trackingData };
    } catch (error) {
      console.error('Error recording product purchase:', error);
      throw error;
    }
  }

  static async recordProductDelivery(
    productId: string,
    buyerAddress: string,
    previousHash: string
  ) {
    try {
      const timestamp = Date.now();
      const hash = this.calculateHash(productId, timestamp, 'delivered', previousHash);

      const trackingData: ProductTrackingData = {
        id: productId,
        timestamp,
        status: 'delivered',
        hash,
        previousHash
      };

      const transaction = await this.createTrackingTransaction(
        trackingData,
        buyerAddress
      );

      return { transaction, trackingData };
    } catch (error) {
      console.error('Error recording product delivery:', error);
      throw error;
    }
  }

  static async getProductHistory(productId: string): Promise<ProductTrackingData[]> {
    try {
      // Fetch transaction history from Solana
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(productId)
      );

      const history: ProductTrackingData[] = [];
      
      for (const { signature } of signatures) {
        const transaction = await this.connection.getTransaction(signature);
        if (transaction?.meta?.logMessages) {
          const trackingData = JSON.parse(transaction.meta.logMessages[0]);
          if (trackingData.id === productId) {
            history.push(trackingData);
          }
        }
      }

      return history.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Error fetching product history:', error);
      throw error;
    }
  }

  private static calculateHash(
    productId: string,
    timestamp: number,
    status: string,
    previousHash: string
  ): string {
    const data = `${productId}${timestamp}${status}${previousHash}`;
    return createHash('sha256').update(data).digest('hex');
  }

  private static async createTrackingTransaction(
    trackingData: ProductTrackingData,
    address: string
  ): Promise<Transaction> {
    // Create a Solana transaction to store tracking data
    const transaction = new Transaction();
    
    // Add instruction to store tracking data
    // In a real implementation, you would use a custom program
    // to store the data on-chain
    
    return transaction;
  }

  static verifyProductAuthenticity(history: ProductTrackingData[]): boolean {
    try {
      for (let i = 1; i < history.length; i++) {
        const currentBlock = history[i];
        const previousBlock = history[i - 1];

        // Verify hash chain
        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }

        // Verify current block's hash
        const calculatedHash = this.calculateHash(
          currentBlock.id,
          currentBlock.timestamp,
          currentBlock.status,
          currentBlock.previousHash
        );

        if (calculatedHash !== currentBlock.hash) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error verifying product authenticity:', error);
      return false;
    }
  }
}