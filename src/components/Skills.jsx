import React, { useState } from "react";
import { motion } from "framer-motion";

const SkillCard = ({ category, skills, icon, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  const skillItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: delay + 0.1 + i * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl backdrop-blur-sm border border-white/10 ${color}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 from-white/5 to-transparent" />
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4 transform transition-transform duration-300">
            {isHovered ? "🚀" : icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {category}
          </h3>
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="flex items-center justify-between"
              variants={skillItemVariants}
              custom={index}
            >
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {skill.name}
              </span>

              {/* Progress Bar */}
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{
                    delay: delay + 0.2 + index * 0.1,
                    duration: 0.8,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16  from-blue-400/20 to-purple-600/20 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12  from-purple-400/20 to-pink-600/20 rounded-full blur-lg" />
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const skillCategories = [
    {
      category: "AI & Machine Learning",
      icon: "🤖",
      color: "#F59E0B",
      skills: [
        { name: "PyTorch", color: "#EE4C2C", level: 88 },
        { name: "Deep Learning", color: "#FF4757", level: 85 },
        { name: "Computer Vision", color: "#9B59B6", level: 82 },
        { name: "Uncertainty Quantification", color: "#FF6F00", level: 80 },
        { name: "TensorFlow", color: "#FF6F00", level: 78 },
        { name: "NumPy / Pandas", color: "#2ECC71", level: 88 },
      ],
    },
    {
      category: "Mathematics & Statistics",
      icon: "📐",
      color: "#8B5CF6",
      skills: [
        { name: "Probability & Statistics", color: "#3776AB", level: 92 },
        { name: "Statistical Inference", color: "#336791", level: 90 },
        { name: "Linear Algebra", color: "#00599C", level: 90 },
        { name: "Stochastic Processes", color: "#9B59B6", level: 80 },
        { name: "Numerical Methods", color: "#E67E22", level: 78 },
        { name: "Optimisation", color: "#2ECC71", level: 80 },
      ],
    },
    {
      category: "Programming Languages",
      icon: "💻",
      color: "#10B981",
      skills: [
        { name: "Python", color: "#3776AB", level: 90 },
        { name: "C++", color: "#00599C", level: 85 },
        { name: "Java", color: "#007396", level: 85 },
        { name: "TypeScript / JavaScript", color: "#3178C6", level: 82 },
        { name: "SQL", color: "#336791", level: 75 },
      ],
    },
    {
      category: "Software Engineering",
      icon: "⚡",
      color: "#3B82F6",
      skills: [
        { name: "AWS (Lambda, S3)", color: "#FF9900", level: 80 },
        { name: "REST & GraphQL APIs", color: "#FF6B6B", level: 85 },
        { name: "Concurrency & Distributed Systems", color: "#68A063", level: 80 },
        { name: "Docker", color: "#2496ED", level: 78 },
        { name: "React / Next.js", color: "#61DAFB", level: 85 },
        { name: "Git & CI/CD", color: "#E34F26", level: 85 },
      ],
    },
  ];

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen  from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-8">
      {/* Title Section */}
      <motion.div
        className="text-center mb-16"
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Skills
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Machine learning, mathematics and statistics, and the software
          engineering to put them into production.
        </p>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {skillCategories.map((category, index) => (
          <SkillCard
            key={category.category}
            category={category.category}
            skills={category.skills}
            icon={category.icon}
            color={category.color}
            delay={index * 0.2}
          />
        ))}
      </motion.div>

    </div>
  );
};

export default Skills;
