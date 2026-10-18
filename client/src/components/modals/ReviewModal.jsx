import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2, ShieldAlert, CornerDownRight } from "lucide-react";
import { reviewsService } from "@/services/reviewsService";

const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

export default function ReviewModal({ isOpen, onClose, booking, onSuccess }) {
  const existingReview = booking?.review;
  const isEdit = Boolean(existingReview);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (existingReview) {
        setRating(existingReview.rating || 5);
        setHoverRating(0);
        setTitle(existingReview.title || "");
        setComment(existingReview.comment || "");
      } else {
        setRating(5);
        setHoverRating(0);
        setTitle("");
        setComment("");
      }
      setError("");
    }
  }, [isOpen, existingReview]);

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || !comment.trim()) {
      setError("Please write your review feedback.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let response;
      if (isEdit && existingReview?.id) {
        response = await reviewsService.updateReview(existingReview.id, {
          rating,
          title: title.trim(),
          comment: comment.trim()
        });
      } else {
        response = await reviewsService.createReview({
          bookingId: booking.id,
          rating,
          title: title.trim(),
          comment: comment.trim()
        });
      }

      if (response.success) {
        if (onSuccess) onSuccess(response.data);
        onClose();
      } else {
        setError(response.message || `Failed to ${isEdit ? "update" : "submit"} review.`);
      }
    } catch (err) {
      console.error("Submit review error:", err);
      setError(err.message || `Failed to ${isEdit ? "update" : "submit"} review. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md card-chai p-6 font-sans">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-heading font-medium text-foreground">
            {isEdit ? "Edit your review" : "Write a review"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit ? "Update your feedback for " : "Share your experience for "}
            <strong className="text-foreground">{booking.service?.title || "Booked service"}</strong> with <strong className="text-foreground">{booking.provider?.fullName || "Provider"}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* STAR RATING PICKER */}
          <div className="space-y-1.5 text-center py-2 bg-card/60 rounded-xl border border-border/80 p-3">
            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
              Overall rating
            </Label>
            <div className="flex justify-center items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= activeRating
                        ? "fill-brand text-brand"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-medium text-foreground block h-4">
              {ratingLabels[activeRating] || ""}
            </span>
          </div>

          {/* REVIEW TITLE */}
          <div className="space-y-1.5">
            <Label htmlFor="review-title" className="text-xs font-medium text-foreground">
              Headline <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent service and very punctual!"
              className="h-10 text-xs rounded-xl"
              maxLength={100}
            />
          </div>

          {/* REVIEW COMMENT */}
          <div className="space-y-1.5">
            <Label htmlFor="review-comment" className="text-xs font-medium text-foreground">
              Your review <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the quality of work, punctuality, and overall experience..."
              className="min-h-[100px] text-xs rounded-xl resize-none p-3"
              required
              maxLength={1000}
            />
          </div>

          {/* PROVIDER OFFICIAL RESPONSE (If available) */}
          {existingReview?.reply && (
            <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-muted-foreground">
                <CornerDownRight className="h-3 w-3" /> Official provider response
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">"{existingReview.reply}"</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="solid"
              className="h-9 text-xs rounded-xl cursor-pointer px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> {isEdit ? "Updating..." : "Submitting..."}
                </>
              ) : (
                isEdit ? "Update review" : "Submit review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
