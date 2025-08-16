import React from "react";
import { motion } from "framer-motion";

const quoteVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const wordVariants = {
  initial: {
    opacity: 0,
    y: 50,
    rotate: 20,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      duration: 1,
    },
  },
};

const getRandomColor = () => {
  const colors = ["#FFFFFF"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const AnimatedText = ({ text, className = "" }) => {
  return (
    <div className="w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden sm:py-0">
      <motion.h1
        className={`inline-block w-full font-bold capitalize text-8xl ${className}`}
        variants={quoteVariants}
        initial="initial"
        animate="animate"
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={word + "-" + index}
            className="inline-block"
            variants={wordVariants}
            style={{ color: getRandomColor() }}
            whileHover={{
              scale: 1.2,
              rotate: [-5, 5, -5, 0],
              transition: { duration: 0.3 },
            }}
          >
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={char + "-" + charIndex}
                className="inline-block"
                whileHover={{
                  scale: 1.5,
                  rotate: 360,
                  transition: { duration: 0.3 },
                }}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};

export default AnimatedText;
