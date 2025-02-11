"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsTab } from "@/components/dashboard/products-tab"
import { AnalyticsTab } from "@/components/dashboard/analytics-tab"
import { SettingsTab } from "@/components/dashboard/settings-tab"
import { StoreTab } from "@/components/dashboard/store-tab"
import { FavoritesTab } from "@/components/dashboard/favorites-tab"
import { UpgradeTab } from "@/components/dashboard/upgrade-tab"
import { BusinessTab } from "@/components/dashboard/business-tab"
import { AISupportTab } from "@/components/dashboard/ai-support-tab"
import { OrdersTab } from "@/components/dashboard/orders-tab"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>
      <Tabs defaultValue="products">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="ai-support">AI Support</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="business">
          <BusinessTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="store">
          <StoreTab />
        </TabsContent>

        <TabsContent value="ai-support">
          <AISupportTab />
        </TabsContent>

        <TabsContent value="upgrade">
          <UpgradeTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}