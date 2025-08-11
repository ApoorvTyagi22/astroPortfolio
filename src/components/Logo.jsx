import React from "react";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <div className="flex items-center justify-center mt-2">
      <motion.a
        href="/"
        className="w-16 h-16 md:w-14 md:h-14 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-2xl md:text-xl sm:text-lg font-bold 
        shadow-lg border border-solid border-dark dark:border-light"
        whileHover={{
          rotateY: 15,
          rotateX: 15,
          scale: 1.1,
          boxShadow: "0px 0px 20px rgba(252, 176, 69, 0.8)",
          transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        style={{
          background: "linear-gradient(135deg, #6ab0de 0%, #0033a0 100%)",
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        <motion.div
          whileHover={{
            skewX: -10,
            transition: { duration: 0.3 },
          }}
        >
          AT
        </motion.div>
      </motion.a>
    </div>
  );
};

export default Logo;
