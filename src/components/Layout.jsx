import React from "react";

// Layout component that takes a prop which is a children component and a className
const Layout = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full h-full inline-block z-0 bg-light p-32 dark:bg-dark xl:p-24 lg:p-16 
      md:p-12 sm:p-8${className}`}
    >
      {children}
    </div>
  );
};

export default Layout;
