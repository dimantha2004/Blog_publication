<p align="center"> <img width="300" src="https://raw.githubusercontent.com/dimantha2004/Blog_publication/main/public/social-card.png" alt="Blog Publication Logo" /> </p>
🚀 Blog Publication
A modern, feature-rich blogging platform built with Next.js, TypeScript, and MDX, designed for easy content creation, SEO optimization, and seamless deployment.

🎯 Highlights
⚡️ Blazing-fast performance powered by Next.js and static generation

Type-safe development with full TypeScript support

App Router structure (src/app/) for clean routing and layouts

MDX support: Compose rich articles with JSX + Markdown

SEO-ready: Metadata, Open Graph, and optimized page titles

Image optimization using Next/Image

Tailwind CSS + global styles for utility-first styling

Linting & format enforcement via ESLint and Prettier

CI/CD integration: Ready for GitHub Actions, Vercel, or Netlify

📦 Features
Content sourcing from .md / .mdx in src/content/posts/

Dynamic routing: Path generated from frontmatter (e.g., /posts/my-first-post)

RSS feed auto-generated from posts

Tag filtering: Group posts by tags/keywords

Pagination & archive views

All Posts page and Home Preview section

Default dark/light theme via CSS variables

🛠️ Project Structure
ruby
Copy
Edit
.
├── public/                  # Static assets (images, fonts, favicon)
├── src/
│   ├── app/                 # Next.js app router (page/layout structure)
│   ├── components/          # Reusable UI components
│   ├── content/
│   │   └── posts/           # Your Markdown/MDX blog posts
│   ├── lib/                 # Helpers/util modules (markdown, feeds, metadata)
│   └── styles/              # Global CSS / Tailwind config
├── .eslintrc.mjs            # Linting rules
├── .prettierrc              # Code formatting conventions
├── next.config.js           # Next.js build config
├── tsconfig.json            # TypeScript config
└── package.json             # Scripts & dependencies
🚧 Getting Started
1. Clone & Install
bash
Copy
Edit
git clone https://github.com/dimantha2004/Blog_publication.git
cd Blog_publication
npm install
# or yarn install / pnpm install
2. Run Dev Server
bash
Copy
Edit
npm run dev
# or yarn dev / pnpm dev
Open http://localhost:3000 in your browser.

✍️ Write Your First Post
Create a new file: src/content/posts/your-title.mdx

Add frontmatter metadata:

md
Copy
Edit
---
title: "Your Post Title"
date: "2025-07-18"
description: "A quick summary of your content."
tags: ["nextjs", "blog"]
---
Start writing in MDX—you can embed React components too!

Visit: http://localhost:3000/posts/your-title

🚀 Build & Deploy
Build the production version:

bash
Copy
Edit
npm run build
Preview locally:

bash
Copy
Edit
npm run preview
Deploy on platforms like:

Vercel: Automatic via GitHub integration

Netlify: Connect repo & build settings

GitHub Pages or custom hosting

