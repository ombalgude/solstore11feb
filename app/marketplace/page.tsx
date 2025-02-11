"use client"

import { Card } from "@/components/ui/card"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { TopSellers } from "@/components/top-sellers"
import { MarketplaceCategories } from "@/components/marketplace-categories"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Categories Section */}
      <MarketplaceCategories onCategorySelect={handleCategoryChange} />

      {/* Top Sellers Section */}
      <TopSellers />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Card className="p-4 sticky top-4">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </Card>
        </aside>

        <main className="flex-1">
          <ProductGrid category={selectedCategory} />
        </main>
      </div>
    </div>
  )
}