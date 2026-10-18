import React from "react";
import { Star, CornerDownRight, Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewCard({
  review,
  providerName,
  allowReply = false,
  replyInput = "",
  onReplyInputChange,
  onReplySubmit,
  isSubmittingReply = false,
  className = "",
  variant = "default",
}) {
  if (!review) return null;

  const name =
    review.name ||
    review.customerName ||
    review.author ||
    "Verified customer";
  const avatar =
    review.avatar ||
    review.customerAvatar ||
    review.customerProfileImage ||
    review.profileImage ||
    null;
  const rating = typeof review.rating === "number" ? review.rating : 5;
  const serviceTitle =
    review.serviceName ||
    review.serviceTitle ||
    review.service?.title ||
    "";
  const date = review.date || review.createdAt || "";
  const title = review.title || "";
  const comment = review.comment || review.quote || "";

  const replyText =
    (review.providerReply && review.providerReply.trim()) ||
    (review.reply && review.reply.trim()) ||
    null;
  const replyDate = review.providerReplyAt;

  if (variant === "testimonial") {
    return (
      <article
        className={cn(
          "card-chai p-6 flex flex-col justify-between gap-4 sm:opacity-90 hover:opacity-100",
          className
        )}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${
                    i < Math.round(rating)
                      ? "fill-amber-500 text-amber-500"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            {date && (
              <span className="text-[11px] text-muted-foreground font-mono">
                {date}
              </span>
            )}
          </div>

          {title && (
            <h3 className="font-display text-sm font-semibold text-foreground">
              {title}
            </h3>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            "{comment}"
          </p>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center gap-3">
          <UserAvatar
            user={{ fullName: name, avatar }}
            className="size-8 rounded-full border border-border"
            size={60}
          />
          <div className="min-w-0">
            <span className="font-display block text-xs font-semibold text-foreground truncate">
              {name}
            </span>
            {serviceTitle && (
              <span className="text-[11px] text-muted-foreground block truncate">
                {serviceTitle}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "card-chai p-5 space-y-3.5 sm:opacity-90 hover:opacity-100",
        className
      )}
    >
      {/* Header: Customer Info & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <UserAvatar
            user={{ fullName: name, avatar }}
            className="size-8 rounded-full border border-border"
            size={80}
          />
          <div>
            <h4 className="font-display text-xs font-semibold text-foreground">
              {name}
            </h4>
            {serviceTitle && (
              <span className="text-[11px] text-muted-foreground block">
                {serviceTitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${
                  i < Math.round(rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-border"
                }`}
              />
            ))}
          </div>
          {date && (
            <span className="text-[11px] text-muted-foreground font-mono">
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Review Content */}
      {title && (
        <h5 className="font-display text-xs font-semibold text-foreground">
          {title}
        </h5>
      )}
      <p className="text-xs text-muted-foreground leading-relaxed">
        "{comment}"
      </p>

      {/* Provider Reply Block */}
      {replyText ? (
        <div className="pl-3 border-l border-border bg-card/40 p-2.5 rounded-r-md space-y-1 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 font-medium text-xs text-foreground">
              <CornerDownRight className="size-3 text-muted-foreground" />
              {providerName ? `Response from ${providerName}` : "Provider response"}
            </span>
            {replyDate && (
              <span className="text-[10px] text-muted-foreground font-mono">
                {replyDate}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {replyText}
          </p>
        </div>
      ) : (
        allowReply && (
          <div className="space-y-2 pt-2 border-t border-border/60">
            <Input
              placeholder="Write a response to this review..."
              value={replyInput}
              onChange={(e) =>
                onReplyInputChange && onReplyInputChange(e.target.value)
              }
              className="text-xs h-8.5 rounded-md bg-card/40 border-border"
            />
            <Button
              size="xs"
              variant="default"
              disabled={isSubmittingReply || !replyInput.trim()}
              onClick={() => onReplySubmit && onReplySubmit(review.id)}
            >
              {isSubmittingReply ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Publish response"
              )}
            </Button>
          </div>
        )
      )}
    </article>
  );
}

export default ReviewCard;
