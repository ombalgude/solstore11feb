"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import Image from "next/image"
import { Facebook, Github, Instagram, Link2, Linkedin, Twitter, Star } from "lucide-react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface DemoStorePageProps {
  params: {
    username: string
  }
}

interface SocialLink {
  platform: string
  url: string
  icon: React.ComponentType<any>
}

// Demo data that matches the preview store layout
const DEMO_STORE = {
  name: "Digital Design Studio",
  username: "designstudio",
  bio: "Premium design resources and templates",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
  coverImage: "https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?w=1200&auto=format&fit=crop&q=60",
  rating: 3,
  badges: ["Top Rated", "High Volume", "Verified Creator"],
  socialLinks: [
    { platform: "Twitter", url: "#", icon: Twitter },
    { platform: "Instagram", url: "#", icon: Instagram },
    { platform: "LinkedIn", url: "#", icon: Linkedin },
    { platform: "GitHub", url: "#", icon: Github }
  ] as SocialLink[],
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
}

export default function DemoStorePage({ params }: DemoStorePageProps) {
  // In a demo, we'll show the same store for any username
  const store = DEMO_STORE

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

      {/* Profile Section */}
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

              {/* Profile Info */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-muted-foreground">@{store.username}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {store.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
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

        {/* Products Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <a href="#" className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Share Store
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="aspect-video relative">
                  <Image
                    src={product.previewUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{product.price} SOL</span>
                    <Button size="sm">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Your Store Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2">
              <Image
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                alt="Solana"
                width={20}
                height={20}
                className="rounded-full"
              />
              Create Your SOL Store
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}