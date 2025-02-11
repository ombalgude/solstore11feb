"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Heart, ShoppingCart, Trash2, AlertCircle, Smartphone } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { FavoritesTikTokView } from "@/components/favorites-tiktok-view"

interface FavoriteProduct {
  id: string
  title: string
  description: string
  price: number
  previewUrl: string
  category: string
  addedAt: Date
  isOnSale?: boolean
  inStock?: boolean
  isLocked?: boolean
}

export function FavoritesTab() {
  const { toast } = useToast()
  const [sortBy, setSortBy] = useState("date")
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showTikTokView, setShowTikTokView] = useState(false)
  const itemsPerPage = 6

  // Demo data - in a real app, this would come from your backend
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([
    {
      id: "1",
      title: "Premium UI Kit",
      description: "Complete UI kit with 100+ components",
      price: 0.5,
      previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60",
      category: "design",
      addedAt: new Date("2024-01-15"),
      isOnSale: true,
      inStock: true,
      isLocked: true
    },
    {
      id: "2",
      title: "Stock Photo Collection",
      description: "100 high-quality stock photos",
      price: 0.3,
      previewUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60",
      category: "photography",
      addedAt: new Date("2024-02-01"),
      inStock: true,
      isLocked: false
    }
  ])

  const handleRemoveFavorite = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId))
    toast({
      title: "Removed from favorites",
      description: "Product has been removed from your favorites"
    })
  }

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart"
    })
  }

  // Sort and filter logic
  const sortedAndFilteredFavorites = favorites
    .filter(product => {
      const matchesCategory = filterCategory === "all" || product.category === filterCategory
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "date":
        default:
          return b.addedAt.getTime() - a.addedAt.getTime()
      }
    })

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredFavorites.length / itemsPerPage)
  const paginatedFavorites = sortedAndFilteredFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">My Favorites</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline"
            onClick={() => setShowTikTokView(true)}
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            TikTok View
          </Button>
          <Input
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="3d">3D</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Heart className="w-12 h-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No favorites yet</h3>
              <p className="text-muted-foreground">
                Start exploring and add items to your favorites!
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFavorites.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="aspect-video relative">
                  <Image
                    src={product.previewUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                        <p className="font-semibold text-destructive">Out of Stock</p>
                      </div>
                    </div>
                  )}
                  {product.isOnSale && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                      Sale
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="space-y-1">
                      <span className="font-semibold">{product.price} SOL</span>
                      <p className="text-xs text-muted-foreground">
                        Added {product.addedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <FavoritesTikTokView
        open={showTikTokView}
        onClose={() => setShowTikTokView(false)}
        products={favorites}
      />
    </div>
  )
}