import { useState, useEffect } from 'react';
import { ProductService } from '@/lib/services/product-service';
import { RatingService } from '@/lib/services/rating-service';
import { PurchaseService } from '@/lib/services/purchase-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/providers';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (category) {
      searchProducts('', category);
    }
  }, [category]);

  async function searchProducts(query: string, productCategory?: string) {
    try {
      const data = await ProductService.searchProducts(query, productCategory);
      setProducts(data);
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error loading products",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function rateProduct(productId: string, rating: number, comment?: string) {
    if (!user?.id) return;

    try {
      await RatingService.rateProduct(productId, user.id, rating, comment);
      // Update the product in the local state
      const updatedProduct = await ProductService.getProduct(productId);
      setProducts(prev => prev.map(p => 
        p.id === productId ? updatedProduct : p
      ));
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!"
      });
    } catch (err: any) {
      toast({
        title: "Error submitting rating",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  }

  async function purchaseProduct(productId: string, price: number, txHash: string) {
    if (!user?.id) return;

    try {
      await PurchaseService.createPurchase(productId, user.id, price, txHash);
      toast({
        title: "Purchase successful",
        description: "Thank you for your purchase!"
      });
    } catch (err: any) {
      toast({
        title: "Error processing purchase",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  }

  return {
    products,
    loading,
    error,
    searchProducts,
    rateProduct,
    purchaseProduct
  };
}