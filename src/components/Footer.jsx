import React from "react";

const profileLinks = [
  { name: "GitHub", href: "https://github.com/apoorvtyagi22" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/apoorv-tyagi22" },
  { name: "Codeforces", href: "https://codeforces.com/profile/tyagip872" },
  { name: "LeetCode", href: "https://leetcode.com/u/apoorv_tyagi/" },
];

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-medium text-lg text-gray-900 dark:text-gray-100">
      <div className="py-8 flex items-center justify-between lg:flex-col lg:gap-4 lg:py-6 px-32 xl:px-24 lg:px-16 md:px-12 sm:px-8">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved</span>
        <div className="flex items-center gap-6 sm:gap-4 flex-wrap justify-center">
          {profileLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>
        <a
          href="/"
          className="hover:text-primary dark:hover:text-primaryDark transition-colors duration-300"
        >
          Apoorv Tyagi
        </a>
      </div>
    </footer>
  );
};

export default Footer;
