import React from "react";
import Layout from "./Layout";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import YouTube from "react-youtube";

const WriteBlogContent = ({ frontmatter, content, url = "" }) => {
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(url);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <article className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center text-blue-800">
                {frontmatter.title}
              </h1>
              <h2 className="text-2xl sm:text-3xl mb-4 text-center text-blue-600">
                {frontmatter.subtitle}
              </h2>
              <p className="text-gray-600 mb-8 text-center text-lg">
                Published on: {frontmatter.date}
              </p>
              <div className="border-t border-gray-200 mb-8"></div>
              {youtubeId && (
                <div className="mb-8 p-4 border-4 border-blue-500 rounded-lg shadow-lg max-w-5xl mx-auto">
                  <div className="aspect-w-16 aspect-h-16">
                    <YouTube
                      videoId={youtubeId}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          autoplay: 0,
                        },
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
              <div className="prose prose-lg sm:prose-xl lg:prose-2xl mx-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                  components={{
                    p: ({ node, children, ...props }) => {
                      if (node.children[0].tagName === "img") {
                        const image = node.children[0];
                        return (
                          <div className="my-8">
                            <img
                              src={image.properties.src}
                              alt={image.properties.alt || ""}
                              className="rounded-lg shadow-md w-full h-auto"
                            />
                            {image.properties.alt && (
                              <p className="text-center text-gray-600 mt-2">
                                {image.properties.alt}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return (
                        <p
                          className="text-xl sm:text-2xl leading-relaxed mb-6"
                          {...props}
                        >
                          {children}
                        </p>
                      );
                    },
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-3xl sm:text-4xl font-bold mt-12 mb-6 text-blue-700"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="text-xl sm:text-2xl list-disc pl-6 mb-6"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-2 text-lg sm:text-xl" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-100 rounded px-1 py-0.5"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  );
};

export default WriteBlogContent;
