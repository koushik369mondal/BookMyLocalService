// Framer Motion shared variants and animation configurations

export const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fade Up Variant
export const fadeInUp = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || 0.35,
      delay: custom.delay || 0,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// Fade In Left
export const fadeInLeft = {
  hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -20 },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration || 0.35,
      delay: custom.delay || 0,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// Fade In Right
export const fadeInRight = {
  hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 20 },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration || 0.35,
      delay: custom.delay || 0,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

// Scale Up Entrance
export const scaleUp = {
  hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration || 0.3,
      delay: custom.delay || 0,
      ease: "easeOut",
    },
  }),
};

// Stagger Container Parent Variant
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Page Transition Variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : -8,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Micro-interaction hover & tap button props
export const buttonMotionProps = {
  whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
  whileTap: prefersReducedMotion ? {} : { scale: 0.98 },
  transition: { duration: 0.15, ease: "easeOut" },
};

// Floating image motion config
export const floatMotionProps = {
  animate: prefersReducedMotion ? {} : { y: [0, -10, 0] },
  transition: {
    duration: 5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};
