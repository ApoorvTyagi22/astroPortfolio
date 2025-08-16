import React, { useState, useEffect } from "react";
import Logo from "./Logo"; // Assuming Logo.jsx is also updated
import { LinkedInIcon, GithubIcon } from "./icons"; // Assuming these are standard React components
import { motion, AnimatePresence } from "framer-motion";
// Removed: import useThemeSwitcher from "./hooks/useThemeSwitcher";
const CustomLink = ({ href, title, className = "", currentPath }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <a
        href={href}
        className={`${className} relative group font-medium antialiased 
                    text-zinc-900 dark:text-zinc-100 
                    hover:text-zinc-950 dark:hover:text-white`}
      >
        {title}
        <span
          className={`h-[2px] inline-block absolute left-0 -bottom-0.5 
                      bg-zinc-900 dark:bg-white 
                      group-hover:w-full transition-[width] ease duration-300
                      ${currentPath === href ? "w-full" : "w-0"}`}
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
      className={`${className} relative group text-white text-2xl font-medium py-2 px-4`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {title}
      <span
        className={`h-[2px] inline-block bg-light dark:bg-dark absolute left-0 -bottom-0.5 
        group-hover:w-full transition-[width] ease duration-300 
        ${currentPath === href ? "w-full" : "w-0"}`}
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

  useEffect(() => {
    const { body } = document;
    if (isOpen) {
      body.style.overflow = "hidden";
      body.style.touchAction = "none"; // helps on mobile
    } else {
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [isOpen]);

  return (
    <motion.header
      className={`w-full px-4 sm:px-6 md:px-8 py-4 font-medium flex items-center justify-between
      dark:text-light fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        scrolled ? "bg-light/70 dark:bg-dark/70 backdrop-blur-md shadow-lg" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Hamburger Menu Button - Only show on small mobile screens */}
      <button
        onClick={handleToggle}
        aria-label="Toggle navigation menu"
        className="absolute right-4 top-3 sm:hidden z-[100] flex flex-col items-center justify-center gap-1"
      >
        <span
          className={`block h-[3px] w-7 rounded bg-white transition-transform duration-300
      ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`}
        />
        <span
          className={`block h-[3px] w-7 rounded bg-white transition-opacity duration-300
      ${isOpen ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`block h-[3px] w-7 rounded bg-white transition-transform duration-300
      ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
        />
      </button>

      {/* Desktop Menu - Show on small screens and up, hide only on very small mobile */}
      <div className="w-full justify-between items-center hidden sm:flex">
        <nav className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
          {/* Pass currentPath down to each link */}
          <CustomLink href="/" title="Home" currentPath={currentPath} />
          <CustomLink
            href="/projects"
            title="Projects"
            currentPath={currentPath}
          />
          <CustomLink href="/blog" title="Blog" currentPath={currentPath} />
        </nav>

        <nav className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[90] sm:hidden flex flex-col items-center justify-center space-y-8
             bg-black/40 dark:bg-black/40 backdrop-blur-xl"
          >
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col items-center space-y-6">
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
            <nav className="sm:hidden flex flex-col items-center justify-center gap-8">
              <motion.a
                href="https://www.linkedin.com/in/apoorv-tyagi22"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="LinkedIn"
                className="inline-flex w-10 h-10 items-center justify-center text-light dark:text-dark"
              >
                <LinkedInIcon />
              </motion.a>

              <motion.a
                href="https://github.com/apoorvtyagi22"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="GitHub"
                className="inline-flex w-10 h-10 items-center justify-center text-light dark:text-dark"
              >
                <GithubIcon />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo in the center */}
      <motion.div
        className="absolute left-[50%] top-2 sm:top-4 translate-x-[-50%]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Logo />
      </motion.div>
    </motion.header>
  );
};

export default NavBar;
