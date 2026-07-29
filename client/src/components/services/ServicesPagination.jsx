import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 px-3 border-[#E8DCC3] rounded-xl text-xs font-bold text-[#5A5146] hover:text-[#8C4B3E]"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#8C4B3E] text-white shadow-sm"
                  : "bg-white text-[#5A5146] hover:bg-[#FAF6F0] border border-[#E8DCC3]"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 px-3 border-[#E8DCC3] rounded-xl text-xs font-bold text-[#5A5146] hover:text-[#8C4B3E]"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
