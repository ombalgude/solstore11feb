"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Star, TrendingUp, Users, CheckCircle } from "lucide-react"
import Image from "next/image"
import { StorePreviewDialog } from "@/components/store-preview-dialog"
import Link from "next/link"

// Demo data - in a real app, this would come from your backend with AI-powered rankings
const CREATORS = [
  {
    id: "1",
    name: "Digital Design Studio",
    username: "designstudio",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?w=1200&auto=format&fit=crop&q=60",
    bio: "Premium design resources and templates",
    category: "Art & Design",
    followers: 15600,
    rating: 3,
    engagement: 89,
    badges: ["Top Rated", "High Volume"],
    isVerified: true,
    products: [/* ... existing products ... */]
  },
  // ... other creators with isVerified property
]

export default function CreatorsPage() {
  // ... existing state and handlers ...

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ... existing filters ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => (
          <Card 
            key={creator.id}
            className="overflow-hidden group hover:shadow-lg transition-all"
          >
            <Link href={`/store/${creator.username}`}>
              <div className="relative h-48">
                <Image
                  src={creator.coverImage}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-background">
                        <Image
                          src={creator.avatar}
                          alt={creator.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {creator.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                          {creator.name}
                        </h3>
                        {creator.isVerified && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-white/80">@{creator.username}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{creator.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{creator.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{creator.engagement}%</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {creator.bio}
                </p>

                <div className="flex flex-wrap gap-2">
                  {creator.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-1 rounded-full bg-secondary text-xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}