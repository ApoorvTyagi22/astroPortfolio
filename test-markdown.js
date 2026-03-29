import fs from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const markdown = `
| Loss Component | Initial | After Adam (20k) | After L-BFGS (30k) |
|---------------|---------|-------------------|---------------------|
| NS momentum (u) | 2.4e-3 | 6.6e-4 | 1.2e-3 |
`;

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(markdown);

console.log(String(file));
