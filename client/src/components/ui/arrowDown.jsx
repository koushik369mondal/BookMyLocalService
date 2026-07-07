import { ArrowDown } from "lucide-react";

export default function ScrollDownButton() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <button
        onClick={scrollToNext}
        className="group flex items-center justify-center w-12 h-12 rounded-full 
                   border border-primary/30 bg-background/70 backdrop-blur-md
                   shadow-lg hover:shadow-primary/30 
                   transition-all duration-300 hover:scale-110"
      >
        <ArrowDown className="h-5 w-5 text-primary animate-bounce group-hover:animate-none" />
      </button>
    </div>
  );
}
