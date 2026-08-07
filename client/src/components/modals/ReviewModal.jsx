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
      <DialogContent className="sm:max-w-md bg-white border border-[#E8DCC3] rounded-3xl p-6 shadow-xl font-sans">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl font-black text-[#1F1D1A]">
            {isEdit ? "View & Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5A5146]">
            {isEdit ? "Update your feedback for " : "Share your experience for "}
            <strong>{booking.service?.title || "Booked Service"}</strong> with <strong>{booking.provider?.fullName || "Provider"}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* STAR RATING PICKER */}
          <div className="space-y-1.5 text-center py-2 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3]/60 p-3">
            <Label className="text-xs font-bold text-[#5A5146] uppercase tracking-wider block">
              Overall Rating
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
                    className={`h-7 w-7 transition-colors ${
                      star <= activeRating
                        ? "fill-[#C9A46A] text-[#C9A46A]"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-black text-[#8C4B3E] block h-4">
              {ratingLabels[activeRating] || ""}
            </span>
          </div>

          {/* REVIEW TITLE */}
          <div className="space-y-1.5">
            <Label htmlFor="review-title" className="text-xs font-bold text-[#1F1D1A]">
              Headline / Title <span className="text-stone-400 font-normal">(Optional)</span>
            </Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent service & very punctual!"
              className="h-10 border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/40"
              maxLength={100}
            />
          </div>

          {/* REVIEW COMMENT */}
          <div className="space-y-1.5">
            <Label htmlFor="review-comment" className="text-xs font-bold text-[#1F1D1A]">
              Your Review <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the quality of work, punctuality, communication, and overall experience..."
              className="min-h-[100px] border-[#E8DCC3] text-xs rounded-xl bg-[#FAF6F0]/40 resize-none p-3"
              required
              maxLength={1000}
            />
          </div>

          {/* PROVIDER OFFICIAL RESPONSE (If available) */}
          {existingReview?.reply && (
            <div className="p-3 bg-[#F0E7D5]/40 border border-[#E8DCC3] rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C9A46A] uppercase">
                <CornerDownRight className="h-3 w-3" /> Official Provider Response
              </div>
              <p className="text-xs font-medium text-[#5A5146] italic">"{existingReview.reply}"</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 text-xs font-bold border-[#E8DCC3] rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-[#8C4B3E] hover:bg-[#723B30] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {isEdit ? "Updating..." : "Submitting..."}
                </>
              ) : (
                isEdit ? "Update Review" : "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
