"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Package, FileText, CheckCircle2, Lock } from "lucide-react"
import Image from "next/image"

interface ProductDeliveryPreviewProps {
  product: {
    id: string
    title: string
    previewUrl: string
    previewVideoUrl?: string
    deliveryDetails: {
      type: string
      format: string
      size: string
      includes: string[]
    }
    isLocked: boolean
  }
}

export function ProductDeliveryPreview({ product }: ProductDeliveryPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Delivery Preview
        </h3>

        <div className="space-y-6">
          {/* Preview Image/Video */}
          <div className="relative">
            <AspectRatio ratio={16/9}>
              <Image
                src={product.previewUrl}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
              />
              {product.previewVideoUrl && (
                <Button
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/90 hover:bg-primary"
                  onClick={() => setShowPreview(true)}
                >
                  <Play className="w-8 h-8 text-white" />
                </Button>
              )}
            </AspectRatio>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Delivery Details</h4>
              <Badge variant="secondary">
                {product.deliveryDetails.type}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Format</p>
                <p className="text-sm text-muted-foreground">
                  {product.deliveryDetails.format}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Size</p>
                <p className="text-sm text-muted-foreground">
                  {product.deliveryDetails.size}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">What's Included:</p>
              <ul className="space-y-2">
                {product.deliveryDetails.includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preview Button */}
          <Button 
            className="w-full"
            onClick={() => setShowPreview(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Full Preview
          </Button>
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="preview" className="mt-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Info</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <div className="space-y-4">
                {product.isLocked ? (
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                        <div className="text-center space-y-4">
                          <Lock className="w-12 h-12 mx-auto text-white" />
                          <p className="text-white font-medium">
                            Purchase to unlock full preview
                          </p>
                        </div>
                      </div>
                      <Image
                        src={product.previewUrl}
                        alt={product.title}
                        fill
                        className="object-cover rounded-lg blur-sm"
                      />
                    </AspectRatio>
                  </div>
                ) : (
                  <AspectRatio ratio={16/9}>
                    {product.previewVideoUrl ? (
                      <video
                        src={product.previewVideoUrl}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <Image
                        src={product.previewUrl}
                        alt={product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </AspectRatio>
                )}
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="mt-4">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Delivery Type</h4>
                      <p className="text-muted-foreground">
                        {product.deliveryDetails.type}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">File Format</h4>
                      <p className="text-muted-foreground">
                        {product.deliveryDetails.format}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">File Size</h4>
                      <p className="text-muted-foreground">
                        {product.deliveryDetails.size}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Package Includes</h4>
                    <ul className="space-y-2">
                      {product.deliveryDetails.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}