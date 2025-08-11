import React, { useState, useEffect } from "react";
import Logo from "./Logo"; // Assuming Logo.jsx is also updated
import { LinkedInIcon, GithubIcon } from "./icons"; // Assuming these are standard React components
import { motion, AnimatePresence } from "framer-motion";
// Removed: import useThemeSwitcher from "./hooks/useThemeSwitcher";

// --- CustomLink Component (Updated) ---
const CustomLink = ({ href, title, className = "", currentPath }) => {
  // Removed: const router = useRouter();
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <a href={href} className={`${className} relative group`}>
        {title}
        <span
          className={`h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 
          group-hover:w-full transition-[width] ease duration-300 
          ${currentPath === href ? "w-full" : "w-0"}`} // Use currentPath prop
        >
          &nbsp;
        </span>
      </a>
    </motion.div>
  );
};

// --- CustomMobileLink Component (Updated) ---
const CustomMobileLink = ({
  href,
  title,
  className = "",
  toggle,
  currentPath,
}) => {
  // Removed: const router = useRouter();

  const handleClick = () => {
    toggle();
    // Use standard browser navigation instead of router.push
    window.location.href = href;
  };

  return (
    <motion.button
      className={`${className} relative group text-light dark:text-dark my-2`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {title}
      <span
        className={`h-[2px] inline-block bg-light absolute left-0 -bottom-0.5 
        group-hover:w-full transition-[width] ease duration-300 
        ${currentPath === href ? "w-full" : "w-0"} dark:bg-dark`} // Use currentPath prop
      >
        &nbsp;
      </span>
    </motion.button>
  );
};

// --- NavBar Component (Main Update) ---
const NavBar = ({ currentPath }) => {
  // Accept currentPath as a prop
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`w-full px-8 py-4 font-medium flex items-center justify-between
      dark:text-light fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        scrolled ? "bg-light/70 dark:bg-dark/70 backdrop-blur-md shadow-lg" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Hamburger Menu Button */}
      <button
        className="flex-col justify-center items-center hidden lg:flex"
        onClick={handleToggle}
      >
        <span
          className={`bg-dark dark:bg-light transition-all duration-300 ease-out block h-0.5 w-6 rounded-sm ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-dark dark:bg-light transition-all duration-300 ease-out block h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-dark dark:bg-light transition-all duration-300 ease-out block h-0.5 w-6 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      {/* Desktop Menu */}
      <div className="w-full flex justify-between items-center lg:hidden">
        <nav className="flex space-x-4">
          {/* Pass currentPath down to each link */}
          <CustomLink href="/" title="Home" currentPath={currentPath} />
          <CustomLink
            href="/projects"
            title="Projects"
            currentPath={currentPath}
          />
          <CustomLink href="/blog" title="Blog" currentPath={currentPath} />
        </nav>

        <nav className="flex items-center justify-center space-x-4">
          <motion.a
            href="https://www.linkedin.com/in/apoorv-tyagi22"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-6"
          >
            <LinkedInIcon />
          </motion.a>
          <motion.a
            href="https://github.com/apoorvtyagi22"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-6"
          >
            <GithubIcon />
          </motion.a>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-8 bg-dark/90 dark:bg-light/90 backdrop-blur-md"
          >
            {/* Pass currentPath down to each mobile link */}
            <nav className="flex flex-col items-center space-y-4">
              <CustomMobileLink
                href="/"
                title="Home"
                toggle={handleToggle}
                currentPath={currentPath}
              />
              <CustomMobileLink
                href="/projects"
                title="Projects"
                toggle={handleToggle}
                currentPath={currentPath}
              />
              <CustomMobileLink
                href="/blog"
                title="Blog"
                toggle={handleToggle}
                currentPath={currentPath}
              />
            </nav>
            {/* Social links for mobile menu */}
            <nav className="flex items-center justify-center space-x-6">
              <motion.a
                href="https://www.linkedin.com/in/apoorv-tyagi22"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8"
              >
                <LinkedInIcon />
              </motion.a>
              <motion.a
                href="https://github.com/apoorvtyagi22"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8"
              >
                <GithubIcon />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo in the center */}
      <motion.div
        className="absolute left-[50%] top-4 translate-x-[-50%]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Logo />
      </motion.div>
    </motion.header>
  );
};

export default NavBar;
