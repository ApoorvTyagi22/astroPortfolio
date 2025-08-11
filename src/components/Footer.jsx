import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 font-medium text-lg text-gray-900 dark:text-gray-100">
      <div className="py-8 flex items-center justify-between lg:flex-col lg:py-6 px-32 xl:px-24 lg:px-16 md:px-12 sm:px-8">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved</span>
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
