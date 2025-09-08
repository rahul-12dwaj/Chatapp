"use client";

import React from "react";
import { motion, useScroll } from "framer-motion";

// simple fallback for merging classes
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ScrollProgress = ({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
};

export default React.forwardRef(ScrollProgress);
