import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

const Skill = ({ name, angle, color, index, totalSkills }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const radius = 30; // Adjust this value to change the size of the circle
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1,
      },
    },
    hover: {
      scale: 1.2,
      zIndex: 10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-full font-semibold text-light 
      py-3 px-6 shadow-lg cursor-pointer
      lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:text-xs xs:py-1 xs:px-2"
      style={{
        background: color,
        boxShadow: isHovered ? `0 0 15px ${color}` : "none",
        left: `${44 + x}%`,
        top: `${40 + y}%`,
        transform: "translate(-50%, -50%)",
      }}
      variants={variants}
      initial="hidden"
      animate={controls}
      whileHover="hover"
      onHoverStart={() => {
        setIsHovered(true);
        controls.start("hover");
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        controls.start("visible");
      }}
      onViewportEnter={() => controls.start("visible")}
      viewport={{ once: true, amount: 0.8 }}
    >
      {name}
    </motion.div>
  );
};

const SkillsWheel = () => {
  const skills = [
    { name: "ReactJs", color: "#61DAFB" },
    { name: "NodeJs", color: "#68A063" },
    { name: "HTML", color: "#E34F26" },
    { name: "NextJs", color: "#000000" },
    { name: "Java", color: "#007396" },
    { name: "Python", color: "#3776AB" },
    { name: "Machine learning", color: "#FF6F00" },
    { name: "Deep learning", color: "#FF6F00" },
    { name: "ExpressJs", color: "#000000" },
    { name: "MongoDb", color: "#47A248" },
    { name: "Tailwind CSS", color: "#06B6D4" },
  ];

  const wheelVariants = {
    hidden: { rotate: -180, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="w-full h-[600px] relative flex items-center justify-center"
      variants={wheelVariants}
      initial="hidden"
      animate="visible"
    >
      <svg className="absolute w-full h-full" style={{ zIndex: -1 }}>
        {skills.map((_, index) => {
          const angle = (index / skills.length) * 2 * Math.PI;
          const x1 = Math.cos(angle) * 30 + 50;
          const y1 = Math.sin(angle) * 30 + 50;
          return (
            <line
              key={index}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2="50%"
              y2="50%"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <motion.div
        className="flex items-center justify-center rounded-full font-semibold bg-purple-600 text-light 
        p-8 shadow-dark cursor-pointer z-10
        lg:p-6 md:p-4 xs:text-xs xs:p-2 xs:font-bold"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 15px rgba(147, 51, 234, 0.7)",
        }}
      >
        Technical Skills
      </motion.div>
      {skills.map((skill, index) => (
        <Skill
          key={skill.name}
          name={skill.name}
          angle={(index / skills.length) * 2 * Math.PI}
          color={skill.color}
          index={index}
          totalSkills={skills.length}
        />
      ))}
    </motion.div>
  );
};

const Skills = () => {
  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white overflow-hidden">
      <motion.h2
        className="font-bold text-8xl pt-20 w-full text-center md:text-6xl"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Skills
      </motion.h2>
      <SkillsWheel />
    </div>
  );
};

export default Skills;
