import React, { useState, useEffect } from "react";

const TypingAnimation = ({ className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [hasFinished, setHasFinished] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [command1Text, setCommand1Text] = useState("");
  const [command2Text, setCommand2Text] = useState("");
  const [showCommand1, setShowCommand1] = useState(false);
  const [showCommand2, setShowCommand2] = useState(false);

  const codeText = 'console.log("Hello World");';
  const outputText = "Hello World";
  const command1 = "sudo useradd -m visitor";
  const command2 = "sudo su - visitor";
  const typingSpeed = 120; // milliseconds per character
  const pauseTime = 1000; // pause after typing code before showing output
  const cursorBlinkSpeed = 530; // milliseconds

  useEffect(() => {
    // Step 0: Type the code
    if (currentStep === 0 && typedText.length < codeText.length) {
      const t = setTimeout(() => {
        setTypedText((prev) => prev + codeText[typedText.length]);
        if (typedText.length + 1 === codeText.length) {
          setIsTyping(false); // hide code cursor immediately
          setTimeout(() => {
            setCurrentStep(1);
            setHasFinished(true); // show output + cursor after pause
          }, pauseTime);
        }
      }, typingSpeed);
      return () => clearTimeout(t);
    }

    // Step 1: After showing output, pause then start first command
    if (currentStep === 1 && hasFinished) {
      const timeout = setTimeout(() => {
        setCurrentStep(2);
        setShowCommand1(true);
      }, pauseTime * 1.5);
      return () => clearTimeout(timeout);
    }

    // Step 2: Type first command
    if (currentStep === 2 && command1Text.length < command1.length) {
      const timeout = setTimeout(() => {
        setCommand1Text((prev) => prev + command1[command1Text.length]);
        if (command1Text.length + 1 === command1.length) {
          setTimeout(() => {
            setCurrentStep(3);
            setShowCommand2(true);
          }, pauseTime);
        }
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }

    // Step 3: Type second command
    if (currentStep === 3 && command2Text.length < command2.length) {
      const timeout = setTimeout(() => {
        setCommand2Text((prev) => prev + command2[command2Text.length]);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [
    currentStep,
    typedText,
    codeText,
    command1Text,
    command1,
    command2Text,
    command2,
    hasFinished,
  ]);

  useEffect(() => {
    // Cursor blinking effect
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`font-mono ${className}`}>
      {/* Terminal-like header */}
      <div className="bg-gray-800 dark:bg-gray-900 rounded-t-lg px-4 sm:px-6 py-3 flex items-center space-x-2 sm:space-x-3 mb-0 shadow-lg">
        <div className="flex space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full shadow-sm"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full shadow-sm"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-sm"></div>
        </div>
        <span className="text-gray-400 text-xs sm:text-sm ml-2 sm:ml-4 font-medium">
          ~/portfolio/terminal
        </span>
        <div className="flex-1"></div>
        <div className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Code container */}
      <div className="bg-gray-900 dark:bg-black rounded-b-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-700 dark:border-gray-600 shadow-2xl min-h-[150px] sm:min-h-[200px]">
        {/* Command prompt */}
        <div className="flex items-center space-x-1 sm:space-x-2 mb-4">
          <span className="text-green-400 text-xs sm:text-sm font-semibold">
            apoorv@portfolio
          </span>
          <span className="text-gray-500">:</span>
          <span className="text-blue-400 text-xs sm:text-sm font-semibold">
            ~
          </span>
          <span className="text-gray-500">$</span>
        </div>

        {/* Typed code */}
        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed mb-4 sm:mb-6 overflow-x-auto">
          <span className="text-purple-400 font-semibold">console</span>
          <span className="text-gray-300">.</span>
          <span className="text-yellow-400 font-semibold">log</span>
          <span className="text-gray-300">(</span>
          <span className="text-green-400">"</span>
          <span className="text-green-400">
            {typedText.slice(13, -3)} {/* Extract just "Hello World" part */}
          </span>
          {typedText.length >= codeText.length && (
            <span className="text-green-400">"</span>
          )}
          {typedText.length >= codeText.length && (
            <span className="text-gray-300">);</span>
          )}
          {isTyping && showCursor && (
            <span className="text-green-400 bg-green-400 ml-1 animate-pulse inline-block w-0.5 h-4 sm:h-6 lg:h-8"></span>
          )}
        </div>

        {/* Output line that appears after typing is complete */}
        {hasFinished && (
          <div className="border-t border-gray-700 pt-4">
            <div className="text-sm sm:text-lg md:text-xl text-gray-300 animate-fade-in flex items-center space-x-2">
              <span className="text-gray-500">&gt;</span>
              <span className="text-white font-medium">{outputText}</span>
              {currentStep === 1 && showCursor && (
                <span className="text-white bg-white ml-1 animate-pulse inline-block w-0.5 h-4 sm:h-6"></span>
              )}
            </div>
          </div>
        )}

        {/* First command */}
        {showCommand1 && (
          <div className="mt-4">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
              <span className="text-green-400 text-xs sm:text-sm font-semibold">
                apoorv@portfolio
              </span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400 text-xs sm:text-sm font-semibold">
                ~
              </span>
              <span className="text-gray-500">$</span>
            </div>
            <div className="text-sm sm:text-lg text-white flex items-center overflow-x-auto">
              <span>{command1Text}</span>
              {currentStep === 2 && showCursor && (
                <span className="text-white bg-white ml-1 animate-pulse inline-block w-0.5 h-4 sm:h-6"></span>
              )}
            </div>
          </div>
        )}

        {/* Second command */}
        {showCommand2 && (
          <div className="mt-4">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
              <span className="text-green-400 text-xs sm:text-sm font-semibold">
                apoorv@portfolio
              </span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400 text-xs sm:text-sm font-semibold">
                ~
              </span>
              <span className="text-gray-500">$</span>
            </div>
            <div className="text-sm sm:text-lg text-white flex items-center overflow-x-auto">
              <span>{command2Text}</span>
              {currentStep === 3 && showCursor && (
                <span className="text-white bg-white ml-1 animate-pulse inline-block w-0.5 h-4 sm:h-6"></span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Programmer subtitle with enhanced styling */}
      <div className="mt-6 sm:mt-8 text-center space-y-4">
        <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm border border-gray-300 dark:border-gray-600">
          <p className="text-sm sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 font-mono mb-2">
            <span className="text-blue-600 dark:text-blue-400">//</span> Welcome
            to my digital workspace
          </p>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-mono">
            <span className="text-green-600 dark:text-green-400">/*</span> Where
            code meets creativity{" "}
            <span className="text-green-600 dark:text-green-400">*/</span>
          </p>
        </div>
        <div className="flex justify-center space-x-4 mt-4 sm:mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TypingAnimation;
