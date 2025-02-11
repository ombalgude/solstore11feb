"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { AddProductDialog } from "./add-product-dialog"
import { EditProductDialog } from "./edit-product-dialog"
import { useState } from "react"
import { Eye, Lock, MoreVertical, Pencil, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export type ContentType = "single" | "collection" | "video" | "custom"

export type Product = {
  id: string
  title: string
  description: string
  price: number
  sales: number
  previewUrl: string
  category: string
  contentType: ContentType
  isLocked: boolean
  collectionItems?: string[]
}

export function ProductsTab() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [productToView, setProductToView] = useState<Product | null>(null)

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prevProducts => [newProduct, ...prevProducts])
  }

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )
    setProductToEdit(null)
    toast({
      title: "Product updated successfully",
      description: "Your changes have been saved."
    })
  }

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productToDelete.id)
      )
      toast({
        title: "Product deleted",
        description: "The product has been removed from your store."
      })
      setProductToDelete(null)
    }
  }

  const toggleLock = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, isLocked: !product.isLocked }
          : product
      )
    )
    toast({
      title: "Product updated",
      description: "Lock status has been updated."
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Products</h2>
        <AddProductDialog onProductAdded={handleAddProduct} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="aspect-video relative">
              <Image
                src={product.previewUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleLock(product.id)}
                >
                  <Lock className={`w-4 h-4 ${product.isLocked ? "text-primary" : "text-muted-foreground"}`} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setProductToView(product)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setProductToEdit(product)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => setProductToDelete(product)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{product.title}</h3>
                <Badge variant="secondary" className="ml-2">
                  {product.contentType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{product.price} SOL</span>
                <span className="text-sm text-muted-foreground">
                  {product.sales} sales
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {productToEdit && (
        <EditProductDialog 
          product={productToEdit}
          onSave={handleEditProduct}
          onCancel={() => setProductToEdit(null)}
        />
      )}

      {productToView && (
        <Dialog open={true} onOpenChange={() => setProductToView(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={productToView.previewUrl}
                  alt={productToView.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{productToView.title}</h2>
                  <Badge variant="secondary">{productToView.contentType}</Badge>
                </div>
                <p className="text-muted-foreground">{productToView.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Price</h4>
                  <p>{productToView.price} SOL</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Category</h4>
                  <p className="capitalize">{productToView.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sales</h4>
                  <p>{productToView.sales}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Status</h4>
                  <p>{productToView.isLocked ? "Locked (Paid)" : "Unlocked (Free)"}</p>
                </div>
              </div>
              {productToView.contentType === "collection" && productToView.collectionItems && (
                <div>
                  <h4 className="font-semibold mb-2">Collection Items</h4>
                  <ul className="space-y-2">
                    {productToView.collectionItems.map((item, index) => (
                      <li key={index} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Premium UI Kit",
    description: "Complete UI kit with 100+ components",
    price: 0.5,
    sales: 24,
    previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60",
    category: "design",
    contentType: "collection",
    isLocked: true,
    collectionItems: [
      "UI Components Library",
      "Design System Guide",
      "Figma Source Files",
      "Documentation"
    ]
  },
  {
    id: "2",
    title: "Stock Photo Collection",
    description: "100 high-quality stock photos",
    price: 0.3,
    sales: 18,
    previewUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60",
    category: "photography",
    contentType: "collection",
    isLocked: true,
    collectionItems: [
      "Nature Collection (25 photos)",
      "Urban Collection (25 photos)",
      "Portrait Collection (25 photos)",
      "Abstract Collection (25 photos)"
    ]
  }
]