"use client";

import React from "react";
import { motion } from "framer-motion";

const presets = {
  fade: {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    },
  },
  slide: {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.1 } },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1] } },
    },
  },
  scale: {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, scale: 0.92 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    },
  },
  blur: {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.1 } },
    },
    item: {
      hidden: { opacity: 0, filter: "blur(8px)", y: 12 },
      visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } },
    },
  },
};

export function AnimatedGroup({ children, className, variants, preset = "slide" }) {
  const resolved = variants ?? presets[preset] ?? presets.slide;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={resolved.container}
      className={className}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={resolved.item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
