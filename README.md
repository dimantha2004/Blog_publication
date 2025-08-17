# 📝 Blog Publication Platform

A modern, fast, and developer-friendly blog platform built with Next.js 14, TypeScript, and MDX. Create beautiful, performant blogs with built-in SEO optimization, dark/light themes, and seamless deployment workflows.

## ✨ Key Features

### 🚀 **Performance & Developer Experience**
- **Blazing Fast**: Static site generation with Next.js App Router
- **Type Safety**: Full TypeScript support throughout the codebase
- **Modern Architecture**: Clean App Router structure (`src/app/`) 
- **Hot Reloading**: Instant development feedback

### 📄 **Content Management**
- **MDX Support**: Write rich articles combining Markdown and React components
- **Frontmatter Metadata**: Structured post information (title, date, tags, description)
- **Dynamic Routing**: Auto-generated URLs from frontmatter slugs
- **Tag System**: Organize and filter posts by categories

### 🎨 **Design & UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Built-in dark/light mode switching
- **Image Optimization**: Next.js Image component for optimal loading
- **Typography**: Clean, readable font choices and spacing

### 🔍 **SEO & Discovery**
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support
- **RSS Feed**: Auto-generated feed for subscribers
- **Sitemap**: Search engine discoverability
- **Performance**: Perfect Lighthouse scores

### 🛠️ **Developer Tools**
- **Code Quality**: ESLint + Prettier for consistent formatting
- **CI/CD Ready**: Pre-configured for GitHub Actions, Vercel, Netlify
- **Git Hooks**: Pre-commit linting and formatting

## 📁 Project Structure

```
blog-publication/
├── public/                    # Static assets
│   ├── images/               # Blog images and media
│   ├── favicon.ico          # Site favicon
│   └── robots.txt           # SEO robots file
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Homepage
│   │   ├── posts/           # Blog post routes
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   └── ThemeToggle.tsx
│   ├── content/
│   │   └── posts/           # MDX blog posts
│   ├── lib/                 # Utility functions
│   │   ├── markdown.ts      # MDX processing
│   │   ├── metadata.ts      # SEO helpers
│   │   └── rss.ts          # RSS feed generation
│   └── styles/              # Additional CSS files
├── .eslintrc.mjs           # ESLint configuration
├── .prettierrc             # Prettier configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dimantha2004/Blog_publication.git
   cd Blog_publication
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ✍️ Creating Your First Post

1. **Create a new MDX file** in `src/content/posts/`:
   ```bash
   touch src/content/posts/my-awesome-post.mdx
   ```

2. **Add frontmatter and content**:
   ```mdx
   ---
   title: "Building Modern Web Applications"
   date: "2025-08-17"
   description: "Learn how to build fast, modern web applications with Next.js and TypeScript."
   tags: ["nextjs", "typescript", "web-development"]
   author: "Your Name"
   ---

   # Introduction

   Welcome to my blog post! Here you can write **markdown** content and even include React components.

   ## Code Examples

   ```javascript
   const greeting = "Hello, World!";
   console.log(greeting);
   ```

   You can also embed custom React components directly in your MDX content.
   ```

3. **View your post**
   Visit `http://localhost:3000/posts/my-awesome-post` to see your published article.

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Edit component styles in individual component files

### Site Configuration
- Update site metadata in `src/app/layout.tsx`
- Modify navigation in `src/components/Header.tsx`
- Customize footer in `src/components/Footer.tsx`

### Content Structure
- Adjust post frontmatter schema in `src/lib/markdown.ts`
- Modify post layout in `src/app/posts/[slug]/page.tsx`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out` or `.next`
3. Node version: 18.x

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [MDX](https://mdxjs.com/) - Markdown for the component era
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types

## 📧 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](https://nextjs.org/docs)
- Join the community discussions

---

<div align="center">
  <strong>Built with ❤️ using Next.js and TypeScript</strong>
</div>
