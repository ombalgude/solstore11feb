"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bitcoin, Users, Camera } from "lucide-react"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const CATEGORIES = [
    { id: "all", name: "All" },
    { id: "crypto", name: "Cryptocurrency & NFTs", icon: Bitcoin },
    { id: "coaching", name: "Business Coaching", icon: Users },
    { id: "content", name: "Content Creation", icon: Camera }
  ]

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2">
        <h3 className="font-semibold mb-4">Categories</h3>
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.icon && <category.icon className="w-4 h-4 mr-2" />}
            {category.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}