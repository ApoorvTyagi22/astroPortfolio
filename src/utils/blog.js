import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getAllArticles() {
  const articlesDirectory = path.join(
    process.cwd(),
    "public/markdownFiles/articles"
  );

  try {
    const filenames = fs.readdirSync(articlesDirectory);

    const articles = filenames
      .filter((name) => name.endsWith(".md"))
      .map((name) => {
        const filePath = path.join(articlesDirectory, name);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data: frontmatter, content } = matter(fileContents);

        // Generate slug from filename
        const slug = name.replace(".md", "");

        return {
          slug,
          frontmatter,
          content,
          filename: name,
        };
      });

    return articles;
  } catch (error) {
    console.error("Error reading articles:", error);
    return [];
  }
}

export function getArticleBySlug(slug) {
  const articles = getAllArticles();
  return articles.find(
    (article) =>
      article.slug === slug || article.filename.replace(".md", "") === slug
  );
}

// Article slug mappings for better URLs
export const articleSlugs = {
  devOpsArticle: "devops-guide",
  HowTheCpuWorks: "cpu-memory-guide",
  "Sparse-Sentence-Encodings": "sparse-sentence-encodings",
  HAXSS: "haxss",
};

export function getSlugFromFilename(filename) {
  const baseFilename = filename.replace(".md", "");
  return articleSlugs[baseFilename] || baseFilename;
}
