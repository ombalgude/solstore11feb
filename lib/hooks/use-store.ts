import { useState, useEffect } from 'react';
import { StoreService } from '@/lib/services/store-service';
import { ProductService } from '@/lib/services/product-service';
import { RatingService } from '@/lib/services/rating-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/providers';

export function useStore(username: string) {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadStore();
  }, [username]);

  async function loadStore() {
    try {
      const data = await StoreService.getStore(username);
      setStore(data);
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error loading store",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateStore(updates: any) {
    if (!store?.id) return;
    
    try {
      const updated = await StoreService.updateStore(store.id, updates);
      setStore(updated);
      toast({
        title: "Store updated",
        description: "Your changes have been saved."
      });
    } catch (err: any) {
      toast({
        title: "Error updating store",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  }

  async function addProduct(product: any) {
    if (!store?.id) return;

    try {
      const newProduct = await ProductService.createProduct({
        ...product,
        creator_id: store.id
      });
      setStore(prev => ({
        ...prev,
        products: [...prev.products, newProduct]
      }));
      toast({
        title: "Product added",
        description: "Your product has been added to your store."
      });
      return newProduct;
    } catch (err: any) {
      toast({
        title: "Error adding product",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  }

  async function rateStore(rating: number, comment?: string) {
    if (!store?.id || !user?.id) return;

    try {
      await RatingService.rateStore(store.id, user.id, rating, comment);
      await loadStore(); // Reload store to get updated ratings
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

  return {
    store,
    loading,
    error,
    updateStore,
    addProduct,
    rateStore
  };
}