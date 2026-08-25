import React from "react";
import { Star, CornerDownRight, Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReviewCard({
  review,
  providerName,
  allowReply = false,
  replyInput = "",
  onReplyInputChange,
  onReplySubmit,
  isSubmittingReply = false,
  className = "",
  variant = "default"
}) {
  if (!review) return null;

  const name = review.name || review.customerName || review.author || "Verified Customer";
  const avatar = review.avatar || review.customerAvatar || review.customerProfileImage || review.profileImage || null;
  const rating = typeof review.rating === "number" ? review.rating : 5;
  const serviceTitle = review.serviceName || review.serviceTitle || review.service?.title || "";
  const date = review.date || review.createdAt || "";
  const title = review.title || "";
  const comment = review.comment || review.quote || "";

  const replyText = (review.providerReply && review.providerReply.trim()) || (review.reply && review.reply.trim()) || null;
  const replyDate = review.providerReplyAt;

  if (variant === "testimonial") {
    return (
      <div className={`p-6 rounded-2xl bg-white border border-[#E8DCC3] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C9A46A] transition-all duration-300 ${className}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(rating)
                      ? "fill-[#C9A46A] text-[#C9A46A]"
                      : "text-[#E8DCC3]"
                  }`}
                />
              ))}
            </div>
            {date && <span className="text-[10px] text-[#7A7266] font-semibold">{date}</span>}
          </div>

          {title && <h3 className="text-sm font-extrabold text-[#1F1D1A]">{title}</h3>}
          <p className="text-xs text-[#5A5146] font-medium leading-relaxed italic">"{comment}"</p>
        </div>

        <div className="pt-3 border-t border-[#E8DCC3]/60 space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              user={{ fullName: name, avatar }}
              className="h-9 w-9 border border-[#E8DCC3]"
              fallbackClassName="bg-[#F0E7D5] text-[#1F1D1A] font-bold text-xs"
              size={60}
            />
            <div>
              <span className="block text-xs font-bold text-[#1F1D1A]">{name}</span>
              {serviceTitle && (
                <span className="text-[10px] text-[#7A7266] font-semibold">{serviceTitle}</span>
              )}
            </div>
          </div>

          {/* Provider Reply block if present */}
          {replyText && (
            <div className="pl-3.5 border-l-2 border-[#C9A46A] bg-[#FAF6F0] p-3 rounded-r-xl space-y-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 font-bold text-[#8C4B3E] text-[10px] uppercase">
                  <CornerDownRight className="h-3 w-3 text-[#C9A46A]" />
                  {providerName ? `Response from ${providerName}` : "Provider Response"}
                </span>
                {replyDate && <span className="text-[9px] text-[#7A7266]">{replyDate}</span>}
              </div>
              <p className="text-[11px] text-[#5A5146] font-medium leading-normal">{replyText}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 border border-[#E8DCC3] rounded-2xl bg-[#FAF6F0]/40 space-y-4 shadow-2xs ${className}`}>
      
      {/* Header: Customer Info & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserAvatar
            user={{ fullName: name, avatar }}
            className="h-10 w-10 border border-[#E8DCC3]"
            fallbackClassName="bg-[#F0E7D5] text-[#1F1D1A] font-bold text-xs"
            size={80}
          />
          <div>
            <h4 className="text-xs font-bold text-[#1F1D1A]">{name}</h4>
            {serviceTitle && (
              <span className="text-[10px] text-[#7A7266] font-semibold block">
                Service: {serviceTitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(rating)
                    ? "fill-[#C9A46A] text-[#C9A46A]"
                    : "text-[#E8DCC3]"
                }`}
              />
            ))}
          </div>
          {date && <span className="text-xs font-bold text-[#7A7266]">{date}</span>}
        </div>
      </div>

      {/* Review Content */}
      {title && <h5 className="text-xs font-black text-[#1F1D1A] -mb-1 px-0.5">{title}</h5>}
      <p className="text-xs font-medium text-[#1F1D1A] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E8DCC3]/60">
        "{comment}"
      </p>

      {/* Provider Reply Block (Display only when present) */}
      {replyText ? (
        <div className="pl-4 border-l-2 border-[#C9A46A] bg-[#F0E7D5]/40 p-3.5 rounded-r-xl space-y-1 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#C9A46A] uppercase tracking-wider">
              <CornerDownRight className="h-3.5 w-3.5 text-[#C9A46A]" />
              {providerName ? `Response from ${providerName}` : "Official Provider Response"}
            </span>
            {replyDate && <span className="text-[10px] font-semibold text-[#7A7266]">{replyDate}</span>}
          </div>
          <p className="text-xs font-medium text-[#5A5146] leading-relaxed">{replyText}</p>
        </div>
      ) : (
        /* Optional Provider Reply Submission Form */
        allowReply && (
          <div className="space-y-2 pt-2 border-t border-[#E8DCC3]/60">
            <Input
              placeholder="Write a public response to this review..."
              value={replyInput}
              onChange={(e) => onReplyInputChange && onReplyInputChange(e.target.value)}
              className="text-xs h-9 border-[#E8DCC3] focus-visible:ring-[#C9A46A] rounded-xl bg-white"
            />
            <Button
              size="xs"
              disabled={isSubmittingReply || !replyInput.trim()}
              onClick={() => onReplySubmit && onReplySubmit(review.id)}
              className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-[10px] uppercase rounded-xl h-8 px-4 border border-[#E8DCC3] cursor-pointer"
            >
              {isSubmittingReply ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Publish Reply"
              )}
            </Button>
          </div>
        )
      )}

    </div>
  );
}

export default ReviewCard;
