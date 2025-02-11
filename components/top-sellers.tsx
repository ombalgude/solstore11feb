"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Award, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { StorePreviewDialog } from "./store-preview-dialog"
import Link from "next/link"

// Demo data - in a real app, this would come from the API with AI-powered rankings
const TOP_SELLERS = [
  {
    id: "1",
    name: "Digital Design Studio",
    username: "designstudio",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?w=1200&auto=format&fit=crop&q=60",
    bio: "Premium design resources and templates",
    rating: 3,
    sales: 156,
    totalRevenue: 78.5,
    badges: ["Top Rated", "High Volume", "Verified Creator"],
    category: "Design",
    products: [
      {
        id: "1",
        title: "Premium UI Kit",
        description: "Complete UI kit with 100+ components",
        price: 0.5,
        previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: "2",
        title: "Icon Pack",
        description: "500+ custom designed icons",
        price: 0.3,
        previewUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: "3",
        title: "Design System",
        description: "Complete design system template",
        price: 0.8,
        previewUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  {
    id: "2",
    name: "Pro Photography",
    username: "prophotos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1552168324-d612d77725e3?w=1200&auto=format&fit=crop&q=60",
    bio: "Professional stock photography collections",
    rating: 2.8,
    sales: 98,
    totalRevenue: 49.0,
    badges: ["Rising Star", "Featured Creator"],
    category: "Photography",
    products: [
      {
        id: "4",
        title: "Nature Collection",
        description: "25 high-quality nature photos",
        price: 0.4,
        previewUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: "5",
        title: "Urban Collection",
        description: "25 urban landscape photos",
        price: 0.4,
        previewUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: "6",
        title: "Portrait Collection",
        description: "25 professional portraits",
        price: 0.5,
        previewUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  {
    id: "3",
    name: "3D Masters",
    username: "3dmasters",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=60",
    bio: "High-quality 3D models and resources",
    rating: 2.9,
    sales: 112,
    totalRevenue: 89.6,
    badges: ["Trending", "Premium Creator"],
    category: "3D",
    products: [
      {
        id: "7",
        title: "3D Character Pack",
        description: "10 rigged character models",
        price: 1.2,
        previewUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: "8",
        title: "Environment Pack",
        description: "5 detailed environments",
        price: 0.9,
        previewUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: "9",
        title: "Props Collection",
        description: "50+ detailed props",
        price: 0.6,
        previewUrl: "https://images.unsplash.com/photo-1617791160588-241658c0f566?w=800&auto=format&fit=crop&q=60"
      }
    ]
  }
]

export function TopSellers() {
  const [selectedStore, setSelectedStore] = useState<typeof TOP_SELLERS[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Top Sellers</h2>
          <p className="text-sm text-muted-foreground">
            Discover our most successful creators
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/marketplace/creators">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOP_SELLERS.map((seller) => (
          <Card 
            key={seller.id} 
            className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelectedStore(seller)}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src={seller.avatar}
                  alt={seller.name}
                  fill
                  className="rounded-full object-cover"
                />
                {seller.badges.includes("Top Rated") && (
                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                    <Award className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {seller.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">@{seller.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium ml-1">{seller.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm ml-1">{seller.sales} sales</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seller.badges.map((badge) => (
                    <div
                      key={badge}
                      className="px-2 py-1 rounded-full bg-secondary text-xs font-medium"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedStore && (
        <StorePreviewDialog
          store={selectedStore}
          open={!!selectedStore}
          onOpenChange={(open) => !open && setSelectedStore(null)}
        />
      )}
    </div>
  )
}