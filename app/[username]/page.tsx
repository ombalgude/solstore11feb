import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import Image from "next/image"
import { Facebook, Github, Instagram, Link2, Linkedin, Twitter } from "lucide-react"

interface CreatorPageProps {
  params: {
    username: string
  }
}

interface SocialLink {
  platform: string
  url: string
  icon: React.ComponentType<any>
}

export default function CreatorPage({ params }: CreatorPageProps) {
  // Demo data
  const store = {
    name: "Demo Creator",
    username: params.username,
    bio: "Digital creator passionate about design and technology",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
    coverImage: "https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?w=1200&auto=format&fit=crop&q=60",
    socialLinks: [
      { platform: "Twitter", url: "#", icon: Twitter },
      { platform: "Instagram", url: "#", icon: Instagram },
      { platform: "LinkedIn", url: "#", icon: Linkedin },
      { platform: "GitHub", url: "#", icon: Github }
    ] as SocialLink[]
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
                <p className="text-muted-foreground">@{store.username}</p>
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
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}