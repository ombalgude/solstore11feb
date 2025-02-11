"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import Image from "next/image"
import { Facebook, Github, Instagram, Link2, Linkedin, Twitter, Star } from "lucide-react"
import { RatingDialog } from "@/components/rating-dialog"
import { SocialStats } from "@/components/social-stats"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProductDeliveryPreview } from "@/components/product-delivery-preview"
import { useToast } from "@/hooks/use-toast"

interface StorePageProps {
  params: {
    username: string
  }
}

// Demo data
const DEMO_TESTIMONIALS = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
    rating: 3,
    comment: "Absolutely love the quality of the digital assets. The attention to detail is amazing!",
    date: "2024-02-01",
    verifiedBuyer: true
  },
  {
    id: "2",
    author: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
    rating: 3,
    comment: "Great experience working with this creator. The products exceeded my expectations.",
    date: "2024-01-28",
    verifiedBuyer: true
  },
  {
    id: "3",
    author: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
    rating: 2,
    comment: "Very professional and responsive. Would definitely buy from again!",
    date: "2024-01-25",
    verifiedBuyer: false
  }
]

export default function StorePage({ params }: StorePageProps) {
  const { toast } = useToast()
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  
  // Demo store data
  const store = {
    id: "1",
    name: "Digital Design Studio",
    username: params.username,
    bio: "Premium design resources and templates",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?w=1200&auto=format&fit=crop&q=60",
    socialLinks: [
      { platform: "Twitter", url: "#", icon: Twitter },
      { platform: "Instagram", url: "#", icon: Instagram },
      { platform: "LinkedIn", url: "#", icon: Linkedin },
      { platform: "GitHub", url: "#", icon: Github }
    ]
  }

  // Demo product data with delivery details
  const demoProduct = {
    id: "1",
    title: "Premium UI Kit",
    previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60",
    previewVideoUrl: "https://example.com/preview.mp4", // Replace with actual video URL
    deliveryDetails: {
      type: "Instant Digital Download",
      format: "Figma, Sketch, Adobe XD",
      size: "250MB",
      includes: [
        "100+ UI Components",
        "Design System Guide",
        "Documentation",
        "Free Updates",
        "Premium Support"
      ]
    },
    isLocked: true
  }

  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <Image
          src={store.coverImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-background">
                <Image
                  src={store.avatar}
                  alt={store.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Store Info */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <p className="text-muted-foreground">@{store.username}</p>
              </div>

              {/* Social Stats */}
              <div className="w-full max-w-lg">
                <SocialStats username={params.username} />
              </div>

              {/* Bio */}
              <p className="max-w-lg text-lg">{store.bio}</p>

              {/* Social Links */}
              <div className="flex flex-wrap justify-center gap-3">
                {store.socialLinks.map((link) => (
                  <Button
                    key={link.platform}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    asChild
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.platform}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Products Section with Delivery Preview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="outline" asChild>
                <a href="#" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Share Store
                </a>
              </Button>
            </div>
            <ProductGrid />
          </div>

          {/* Product Delivery Preview Sidebar */}
          <div className="lg:col-span-1">
            <ProductDeliveryPreview product={demoProduct} />
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection 
          storeId={store.id}
          testimonials={DEMO_TESTIMONIALS}
        />
      </div>

      <RatingDialog
        storeId={store.id}
        storeName={store.name}
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        onRatingSubmit={async (rating, comment) => {
          console.log("Rating submitted:", { rating, comment })
          setShowRatingDialog(false)
          toast({
            title: "Review submitted",
            description: "Thank you for your feedback!"
          })
        }}
      />
    </div>
  )
}