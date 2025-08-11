import React from "react";
import { Link } from "react-scroll";

const TableOfContent = ({ headings }) => {
  return (
    <nav className="table-of-contents bg-gray-100 p-4 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} className="text-lg">
            <Link
              to={heading.id}
              smooth={true}
              duration={500}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContent;
