"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Star, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import { StorePreviewDialog } from "@/components/store-preview-dialog"

// Demo data - in a real app, this would come from your backend with AI-powered rankings
const CREATORS = [
  // Art & Design
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
    badges: ["Top Rated", "High Volume", "Verified Creator"],
    products: [
      {
        id: "1",
        title: "Premium UI Kit",
        description: "Complete UI kit with 100+ components",
        price: 0.5,
        previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  // Music
  {
    id: "2",
    name: "Sonic Labs",
    username: "soniclabs",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=60",
    bio: "Professional sound kits and music production tools",
    category: "Music",
    followers: 12400,
    rating: 2.9,
    engagement: 92,
    badges: ["Trending", "Featured Artist"],
    products: [
      {
        id: "2",
        title: "Future Bass Pack",
        description: "Premium sound kit for producers",
        price: 0.8,
        previewUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  // Gaming
  {
    id: "3",
    name: "Game Assets Pro",
    username: "gameassets",
    avatar: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&auto=format&fit=crop&q=60",
    bio: "Professional game assets and resources",
    category: "Gaming",
    followers: 9800,
    rating: 2.8,
    engagement: 85,
    badges: ["Rising Star", "Gaming Expert"],
    products: [
      {
        id: "3",
        title: "Game UI Pack",
        description: "Complete game interface kit",
        price: 1.2,
        previewUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  // Education
  {
    id: "4",
    name: "Tech Academy",
    username: "techacademy",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=60",
    bio: "Premium coding tutorials and courses",
    category: "Education",
    followers: 18900,
    rating: 2.95,
    engagement: 94,
    badges: ["Top Educator", "Community Leader"],
    products: [
      {
        id: "4",
        title: "Web Dev Masterclass",
        description: "Complete web development course",
        price: 2.0,
        previewUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  // Lifestyle
  {
    id: "5",
    name: "Wellness Hub",
    username: "wellnesshub",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&auto=format&fit=crop&q=60",
    bio: "Premium wellness and lifestyle content",
    category: "Lifestyle",
    followers: 21300,
    rating: 2.85,
    engagement: 88,
    badges: ["Wellness Expert", "Community Choice"],
    products: [
      {
        id: "5",
        title: "Wellness Guide",
        description: "Complete lifestyle transformation guide",
        price: 0.9,
        previewUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60"
      }
    ]
  }
]

export default function CreatorsPage() {
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("engagement")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCreator, setSelectedCreator] = useState<typeof CREATORS[0] | null>(null)

  // Filter and sort creators
  const filteredCreators = CREATORS
    .filter(creator => {
      const matchesCategory = category === "all" || creator.category.toLowerCase() === category
      const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "followers":
          return b.followers - a.followers
        case "rating":
          return b.rating - a.rating
        case "engagement":
        default:
          return b.engagement - a.engagement
      }
    })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Top Creators</h1>
            <p className="text-muted-foreground">
              Discover the most talented creators across all categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{CREATORS.length} Creators</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="art & design">Art & Design</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => (
          <Card 
            key={creator.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelectedCreator(creator)}
          >
            {/* Cover Image */}
            <div className="relative h-32">
              <Image
                src={creator.coverImage}
                alt={creator.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-background">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {creator.badges.includes("Top Rated") && (
                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                      <Award className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">@{creator.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium ml-1">{creator.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm ml-1">
                        {creator.followers.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm ml-1">{creator.engagement}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                {creator.bio}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {creator.badges.map((badge) => (
                  <div
                    key={badge}
                    className="px-2 py-1 rounded-full bg-secondary text-xs font-medium"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCreator && (
        <StorePreviewDialog
          store={selectedCreator}
          open={!!selectedCreator}
          onOpenChange={(open) => !open && setSelectedCreator(null)}
        />
      )}
    </div>
  )
}