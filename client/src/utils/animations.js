// Animation presets and utilities for Framer Motion
export const animationPresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  bounce: {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.9 },
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      type: "spring",
      bounce: 0.4
    }
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Scroll-triggered animation variants
export const scrollAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" }
  },
  staggerChildren: {
    initial: {},
    whileInView: {},
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    },
    viewport: { once: true }
  }
};

// Parallax effect utilities
export const parallaxVariants = {
  slow: {
    y: [0, -50],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  },
  medium: {
    y: [0, -100],
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  },
  fast: {
    y: [0, -150],
    transition: {
      y: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }
};

// Hover animations
export const hoverAnimations = {
  lift: {
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.2 }
  },
  glow: {
    whileHover: { 
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      scale: 1.02
    },
    transition: { duration: 0.2 }
  },
  rotate: {
    whileHover: { rotate: 5, scale: 1.05 },
    transition: { duration: 0.2 }
  },
  pulse: {
    whileHover: { scale: [1, 1.05, 1] },
    transition: { duration: 0.3, repeat: Infinity }
  }
};

// Animation timing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275]
};

// Utility function to create custom animations
export const createAnimation = (type, options = {}) => {
  const baseAnimation = animationPresets[type] || animationPresets.fade;
  
  return {
    ...baseAnimation,
    transition: {
      ...baseAnimation.transition,
      ...options.transition
    },
    ...options
  };
};

// Utility function to create scroll-triggered animations
export const createScrollAnimation = (type, options = {}) => {
  const baseAnimation = scrollAnimations[type] || scrollAnimations.fadeInUp;
  
  return {
    ...baseAnimation,
    transition: {
      ...baseAnimation.transition,
      ...options.transition
    },
    viewport: {
      ...baseAnimation.viewport,
      ...options.viewport
    },
    ...options
  };
};

// Animation duration presets
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2
};

// Stagger animation helper
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
