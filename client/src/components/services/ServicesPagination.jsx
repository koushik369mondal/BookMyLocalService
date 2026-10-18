import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8.5 px-3 text-xs"
      >
        <ChevronLeft className="size-3.5" />
        <span>Previous</span>
      </Button>

      <div className="flex items-center gap-1 font-mono">
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`size-8 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border/80 bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8.5 px-3 text-xs"
      >
        <span>Next</span>
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  );
}
