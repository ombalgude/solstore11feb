"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StorePreviewDialog } from "./store-preview-dialog"
import { motion } from "framer-motion"
import { Store, Star, ShoppingBag } from "lucide-react"
import Image from "next/image"

const DEMO_STORES = [
  {
    id: "minimal-store",
    name: "Minimal Store",
    username: "minimalstore",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=60",
    bio: "Clean and minimal digital assets",
    rating: 2.8,
    badges: ["Minimalist", "Design Focus"],
    products: [
      {
        id: "m1",
        title: "Minimal UI Kit",
        description: "Clean and modern UI components",
        price: 0.8,
        previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  {
    id: "premium-store",
    name: "Premium Store",
    username: "premiumstore",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60",
    bio: "Premium digital content and templates",
    rating: 2.9,
    badges: ["Premium", "Featured"],
    products: [
      {
        id: "p1",
        title: "Premium Template Pack",
        description: "High-end design templates",
        price: 1.2,
        previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  {
    id: "creative-store",
    name: "Creative Store",
    username: "creativestore",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&auto=format&fit=crop&q=60",
    bio: "Creative digital assets and resources",
    rating: 3.0,
    badges: ["Creative", "Trending"],
    products: [
      {
        id: "c1",
        title: "Creative Asset Bundle",
        description: "Unique creative resources",
        price: 0.9,
        previewUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  {
    id: "dark-theme",
    name: "Dark Theme Store",
    username: "darkstore",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&auto=format&fit=crop&q=60",
    bio: "Dark themed digital resources",
    rating: 2.7,
    badges: ["Dark Theme", "Modern"],
    products: [
      {
        id: "d1",
        title: "Dark UI Kit",
        description: "Modern dark theme components",
        price: 0.7,
        previewUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&auto=format&fit=crop&q=60"
      }
    ]
  }
]

export function StoreShowcase() {
  const [selectedStore, setSelectedStore] = useState<typeof DEMO_STORES[0] | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Store Themes</h2>
        <p className="text-muted-foreground">
          Explore different store layouts and themes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEMO_STORES.map((store) => (
          <motion.div
            key={store.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedStore(store)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden group">
              <div className="aspect-video relative">
                <Image
                  src={store.coverImage}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-background">
                      <Image
                        src={store.avatar}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-xs text-white/80">@{store.username}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{store.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {store.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-1 rounded-full bg-secondary text-xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
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