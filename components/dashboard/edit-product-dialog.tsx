"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Product } from "./products-tab"

interface EditProductDialogProps {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}

export function EditProductDialog({ product, onSave, onCancel }: EditProductDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price.toString(),
    previewFile: null as File | null,
    contentFile: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [e.target.id + "File"]: e.target.files![0]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      // Here you would handle the actual file uploads
      const previewUrl = formData.previewFile 
        ? URL.createObjectURL(formData.previewFile)
        : product.previewUrl

      const updatedProduct: Product = {
        ...product,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        previewUrl,
        category: formData.category
      }

      onSave(updatedProduct)
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product"
              className="resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="templates">Templates</SelectItem>
                <SelectItem value="code">Code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (SOL)</Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01" 
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview">Preview Image (Optional)</Label>
            <Input 
              id="preview" 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to keep the current preview image
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Product Content (Optional)</Label>
            <Input 
              id="content" 
              type="file"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to keep the current content file
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}