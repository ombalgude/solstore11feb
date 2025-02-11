"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Product, ContentType } from "./products-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface AddProductDialogProps {
  onProductAdded: (product: Product) => void
}

export function AddProductDialog({ onProductAdded }: AddProductDialogProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const [contentType, setContentType] = useState<ContentType>("single")
  const [isLocked, setIsLocked] = useState(true)
  const [collectionItems, setCollectionItems] = useState<string[]>([])
  const [newCollectionItem, setNewCollectionItem] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
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

  const addCollectionItem = () => {
    if (newCollectionItem.trim()) {
      setCollectionItems(prev => [...prev, newCollectionItem.trim()])
      setNewCollectionItem("")
    }
  }

  const removeCollectionItem = (index: number) => {
    setCollectionItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const previewUrl = formData.previewFile 
        ? URL.createObjectURL(formData.previewFile)
        : "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60"

      const newProduct: Product = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        sales: 0,
        previewUrl,
        category: formData.category,
        contentType,
        isLocked,
        ...(contentType === "collection" && { collectionItems })
      }

      onProductAdded(newProduct)
      
      toast({
        title: "Product added successfully",
        description: "Your new product is now live in your store."
      })

      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        previewFile: null,
        contentFile: null,
      })
      setContentType("single")
      setCollectionItems([])
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="locked"
                  checked={isLocked}
                  onCheckedChange={setIsLocked}
                />
                <Label htmlFor="locked" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Paid Content
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="space-y-4">
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(["single", "collection", "video", "custom"] as ContentType[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={contentType === type ? "default" : "outline"}
                      className="h-auto py-4 px-3"
                      onClick={() => setContentType(type)}
                    >
                      <div className="text-center space-y-2">
                        <div className="capitalize font-semibold">{type}</div>
                        <div className="text-xs text-muted-foreground">
                          {type === "single" && "Single file upload"}
                          {type === "collection" && "Multiple items"}
                          {type === "video" && "Video content"}
                          {type === "custom" && "Custom delivery"}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {contentType === "collection" && (
                <div className="space-y-4">
                  <Label>Collection Items</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCollectionItem}
                      onChange={(e) => setNewCollectionItem(e.target.value)}
                      placeholder="Add item to collection"
                    />
                    <Button type="button" onClick={addCollectionItem}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {collectionItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                        <span>{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCollectionItem(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="preview">Preview Image</Label>
                <Input 
                  id="preview" 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This image will be shown to potential buyers
                </p>
              </div>

              {contentType !== "collection" && (
                <div className="space-y-2">
                  <Label htmlFor="content">
                    {contentType === "video" ? "Video File" : "Product Content"}
                  </Label>
                  <Input 
                    id="content" 
                    type="file"
                    accept={contentType === "video" ? "video/*" : undefined}
                    onChange={handleFileChange}
                    required
                  />
                </div>
              )}
            </TabsContent>

            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}