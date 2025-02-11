"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Testimonial {
  id: string
  author: string
  avatar: string
  rating: number
  comment: string
  date: string
  verifiedBuyer: boolean
}

interface TestimonialsSectionProps {
  storeId: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({ storeId, testimonials }: TestimonialsSectionProps) {
  const { toast } = useToast()
  const [showAddTestimonial, setShowAddTestimonial] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    rating: 0,
    comment: ""
  })

  const handleSubmitTestimonial = async () => {
    if (newTestimonial.rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive"
      })
      return
    }

    if (!newTestimonial.comment.trim()) {
      toast({
        title: "Please enter a comment",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Here you would make an API call to save the testimonial
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Testimonial submitted",
        description: "Thank you for your feedback!"
      })
      setShowAddTestimonial(false)
      setNewTestimonial({ rating: 0, comment: "" })
    } catch (error) {
      toast({
        title: "Error submitting testimonial",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Customer Testimonials</h2>
          <p className="text-muted-foreground">
            What our customers are saying
          </p>
        </div>
        <Button onClick={() => setShowAddTestimonial(true)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Write a Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold truncate">{testimonial.author}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        {testimonial.verifiedBuyer && (
                          <span className="text-xs text-green-500 font-medium">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(testimonial.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="relative">
                    <Quote className="w-4 h-4 absolute -left-6 -top-2 text-primary opacity-20" />
                    <p className="text-muted-foreground">{testimonial.comment}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showAddTestimonial} onOpenChange={setShowAddTestimonial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Button
                    key={i}
                    variant={newTestimonial.rating > i ? "default" : "outline"}
                    size="lg"
                    className="flex-1"
                    onClick={() => setNewTestimonial(prev => ({ ...prev, rating: i + 1 }))}
                  >
                    <Star className={`w-4 h-4 ${newTestimonial.rating > i ? "fill-current" : ""}`} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <Textarea
                value={newTestimonial.comment}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTestimonial(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitTestimonial}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}