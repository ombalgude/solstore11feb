"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RatingDialogProps {
  storeId: string
  storeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRatingSubmit: (rating: number, comment: string) => Promise<void>
}

export function RatingDialog({
  storeId,
  storeName,
  open,
  onOpenChange,
  onRatingSubmit
}: RatingDialogProps) {
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onRatingSubmit(rating, comment)
      onOpenChange(false)
      setRating(0)
      setComment("")
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!"
      })
    } catch (error) {
      toast({
        title: "Error submitting rating",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {storeName}</DialogTitle>
          <DialogDescription>
            Share your experience with this creator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-4 items-center">
              {[1, 2, 3].map((value) => (
                <Button
                  key={value}
                  variant={rating === value ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setRating(value)}
                >
                  <Star className={`w-4 h-4 ${rating >= value ? "fill-current" : ""}`} />
                  <span className="ml-2">
                    {value === 1 ? "Poor" : value === 2 ? "Good" : "Excellent"}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (Optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this creator..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}