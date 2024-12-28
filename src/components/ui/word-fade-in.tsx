"use client";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface WordFadeInProps {
  words: string;
  className?: string;
  delay?: number;
  variants?: Variants;
}

export default function WordFadeIn({
  words,
  delay = 0.15,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay },
    }),
  },
  className,
}: WordFadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, // Animate only once when entering view
    margin: "-100px" // Adjust margin as needed
  });

  const _words = words.split(" ");

  return (
    <motion.h1
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "font-display text-center text-3xl font-semibold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-3xl md:leading-[5rem]",
        className,
      )}
    >
      {_words.map((word, i) => (
        <motion.span 
          key={word} 
          variants={variants} 
          custom={i}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.h1>
  );
}
