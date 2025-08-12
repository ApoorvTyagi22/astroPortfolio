# Blog System Documentation

## Overview

The blog system has been successfully added to your Astro portfolio. Here's how it works:

## File Structure

```
src/
├── components/
│   └── BlogContent.jsx          # Reusable blog content renderer
├── pages/
│   ├── blog.astro              # Main blog listing page
│   └── blog/
│       ├── devops-guide.astro  # DevOps article page
│       └── cpu-memory-guide.astro # CPU article page
└── utils/
    └── blog.js                 # Blog utility functions

public/
└── markdownFiles/
    └── articles/
        ├── devOpsArticle.md    # DevOps article content
        └── HowTheCpuWorks.md   # CPU article content
```

## Features

### ✨ Main Blog Page (`/blog`)

- **Featured Articles Section**: Highlights your best content
- **All Articles Section**: Lists all published articles
- **Coming Soon Section**: Shows upcoming content
- **Responsive Design**: Looks great on all devices
- **Dynamic Loading**: Automatically reads articles from markdown files

### 📝 Individual Article Pages

- **Professional Layout**: Clean, readable article presentation
- **Markdown Rendering**: Full support for code blocks, math equations, etc.
- **Article Metadata**: Shows date, read time, category, author
- **Navigation**: Easy links back to blog and to projects
- **SEO Optimized**: Proper meta tags and descriptions

### 🔧 Technical Features

- **Automatic Article Discovery**: Reads all `.md` files from articles directory
- **Frontmatter Support**: Uses YAML frontmatter for article metadata
- **Clean URLs**: `/blog/devops-guide` instead of `/blog/devOpsArticle`
- **KaTeX Support**: Renders mathematical equations
- **Syntax Highlighting**: Beautiful code blocks with VS Code theme

## Adding New Articles

### 1. Create Markdown File

Add a new `.md` file to `public/markdownFiles/articles/`:

```markdown
---
title: "Your Article Title"
subtitle: "A brief description of your article"
date: "MM/DD/YYYY"
---

## Your Article Content

Write your article content here using markdown syntax.
```

### 2. Create Article Page

Create a new `.astro` file in `src/pages/blog/`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import NavBar from '../../components/NavBar.jsx';
import Footer from '../../components/Footer.jsx';
import BlogContent from '../../components/BlogContent.jsx';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const filePath = path.join(process.cwd(), 'public/markdownFiles/articles', 'your-article.md');
const fileContents = fs.readFileSync(filePath, 'utf8');
const { data: frontmatter, content } = matter(fileContents);

frontmatter.category = 'Your Category';
frontmatter.readTime = 'X min read';
---

<Layout title={frontmatter.title} description={frontmatter.subtitle}>
  <NavBar currentPath="/blog" client:load />
  <BlogContent frontmatter={frontmatter} content={content} client:load />
  <Footer />
</Layout>
```

### 3. Update Slug Mapping (Optional)

If you want a custom URL slug, update `src/utils/blog.js`:

```javascript
export const articleSlugs = {
  devOpsArticle: "devops-guide",
  HowTheCpuWorks: "cpu-memory-guide",
  "your-article": "custom-url-slug", // Add your mapping
};
```

## Current Articles

### 1. DevOps Guide

- **URL**: `/blog/devops-guide`
- **File**: `devOpsArticle.md`
- **Category**: DevOps
- **Topics**: CI/CD, automation, infrastructure

### 2. CPU & Memory Guide

- **URL**: `/blog/cpu-memory-guide`
- **File**: `HowTheCpuWorks.md`
- **Category**: Computer Science
- **Topics**: CPU architecture, memory management

## Navigation

The blog is accessible from:

- **Main Navigation**: "Blog" link in header
- **Home Page**: "View Blogs" button in hero section
- **Direct URLs**: `/blog`, `/blog/article-slug`

## Styling

The blog uses the same design system as your portfolio:

- **Consistent Colors**: Matches your blue/purple theme
- **Typography**: Professional, readable fonts
- **Responsive**: Mobile-first design
- **Dark Mode**: Full dark mode support
- **Animations**: Smooth transitions and hover effects

## Next Steps

1. **Add More Articles**: Follow the guide above to add new content
2. **Customize Categories**: Add new categories as needed
3. **SEO Optimization**: Add more detailed meta descriptions
4. **Social Sharing**: Add social sharing buttons if desired
5. **Comments**: Consider adding a comment system like Disqus

Your blog system is now fully functional and ready for content!
