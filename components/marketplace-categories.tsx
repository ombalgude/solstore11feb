"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bitcoin, BookOpen, BrainCircuit, Camera, Star, ShoppingCart, Users, Briefcase, GraduationCap, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface Category {
  id: string
  name: string
  icon: React.ComponentType<any>
  itemCount: number
  description: string
  color: string
  items: {
    id: string
    title: string
    description: string
    price: number
    previewUrl: string
    rating: number
  }[]
}

interface MarketplaceCategoriesProps {
  onCategorySelect: (category: string) => void
}

const CATEGORIES: Category[] = [
  {
    id: "crypto",
    name: "Cryptocurrency & NFTs",
    icon: Bitcoin,
    itemCount: 156,
    description: "Digital assets, NFT collections, and crypto resources",
    color: "from-yellow-500/10 to-orange-500/10",
    items: [
      {
        id: "c1",
        title: "NFT Masterclass",
        description: "Complete guide to creating and selling NFTs",
        price: 1.2,
        previewUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=60",
        rating: 2.9
      },
      {
        id: "c2",
        title: "Crypto Trading Course",
        description: "Professional trading strategies",
        price: 2.5,
        previewUrl: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&auto=format&fit=crop&q=60",
        rating: 2.8
      }
    ]
  },
  {
    id: "coaching",
    name: "Business Coaching",
    icon: Users,
    itemCount: 89,
    description: "Expert guidance and business mentorship programs",
    color: "from-blue-500/10 to-purple-500/10",
    items: [
      {
        id: "m1",
        title: "Startup Mentorship",
        description: "1-on-1 startup guidance program",
        price: 3.0,
        previewUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
        rating: 3.0
      },
      {
        id: "m2",
        title: "Leadership Course",
        description: "Advanced leadership development",
        price: 2.0,
        previewUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60",
        rating: 2.9
      }
    ]
  },
  {
    id: "onlyfans",
    name: "OnlyFans Creators",
    icon: Heart,
    itemCount: 124,
    description: "Premium content creation guides and resources",
    color: "from-pink-500/10 to-red-500/10",
    items: [
      {
        id: "o1",
        title: "Content Creator Pack",
        description: "Professional content creation toolkit",
        price: 1.5,
        previewUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800&auto=format&fit=crop&q=60",
        rating: 2.8
      },
      {
        id: "o2",
        title: "Social Media Guide",
        description: "Comprehensive social media strategy",
        price: 0.8,
        previewUrl: "https://images.unsplash.com/photo-1534131707746-25d604851a1f?w=800&auto=format&fit=crop&q=60",
        rating: 2.9
      }
    ]
  },
  {
    id: "courses",
    name: "Online Courses",
    icon: GraduationCap,
    itemCount: 245,
    description: "Professional development and skill-building courses",
    color: "from-green-500/10 to-emerald-500/10",
    items: [
      {
        id: "edu1",
        title: "Digital Marketing",
        description: "Complete digital marketing course",
        price: 2.0,
        previewUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
        rating: 2.9
      },
      {
        id: "edu2",
        title: "Web Development",
        description: "Full-stack development bootcamp",
        price: 3.5,
        previewUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
        rating: 3.0
      }
    ]
  },
  {
    id: "consulting",
    name: "Consultants",
    icon: Briefcase,
    itemCount: 167,
    description: "Expert consulting services across industries",
    color: "from-indigo-500/10 to-blue-500/10",
    items: [
      {
        id: "cons1",
        title: "Business Strategy",
        description: "Strategic business consulting package",
        price: 4.0,
        previewUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
        rating: 2.9
      },
      {
        id: "cons2",
        title: "Financial Advisory",
        description: "Professional financial consulting",
        price: 3.5,
        previewUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
        rating: 2.8
      }
    ]
  },
  {
    id: "content",
    name: "Content Creation",
    icon: Camera,
    itemCount: 92,
    description: "Professional content creation tools and resources",
    color: "from-red-500/10 to-pink-500/10",
    items: [
      {
        id: "cont1",
        title: "Video Production Kit",
        description: "Professional video creation tools",
        price: 1.8,
        previewUrl: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&auto=format&fit=crop&q=60",
        rating: 2.8
      },
      {
        id: "cont2",
        title: "Content Strategy Guide",
        description: "Content planning and strategy toolkit",
        price: 1.2,
        previewUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
        rating: 2.9
      }
    ]
  }
]

export function MarketplaceCategories({ onCategorySelect }: MarketplaceCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCategoryClick = (category: Category) => {
    onCategorySelect(category.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Browse Categories</h2>
        <p className="text-muted-foreground">
          Explore our curated collection of digital content
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category)}
            className="cursor-pointer"
          >
            <Card className="relative overflow-hidden h-full hover:shadow-lg transition-all">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

              <div className="relative p-4 sm:p-6 space-y-4">
                {/* Icon and Count */}
                <div className="flex items-start justify-between">
                  <div className="p-2 sm:p-3 bg-background rounded-xl">
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="font-mono text-xs sm:text-sm cursor-pointer hover:bg-secondary/80"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCategory(category)
                    }}
                  >
                    {category.itemCount} items
                  </Badge>
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Category Dialog */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory?.icon && <selectedCategory.icon className="w-5 h-5" />}
              {selectedCategory?.name} Items
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
            {selectedCategory?.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={item.previewUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 fill-primary text-primary`} />
                      <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{item.price} SOL</span>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Buy Now</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}