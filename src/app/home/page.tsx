import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <Image
          className="dark:invert mb-2"
          src="/file.svg"
          alt="BlogApp logo"
          width={48}
          height={48}
          priority
        />
        <h1 className="text-4xl font-bold mb-2 text-center">Blog Publication</h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-6">
          Publish your thoughts, share your stories. A simple blog platform for everyone.
        </p>
        <button
          className="rounded-full bg-foreground text-background px-8 py-3 font-semibold text-lg shadow hover:bg-[#383838] dark:hover:bg-[#ccc] hover:text-foreground transition-colors mb-8"
          disabled
        >
          Create Blog
        </button>
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          <ul className="flex flex-col gap-4">
            <li className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181818] shadow-sm">
              <h3 className="font-bold text-lg mb-1">Welcome to BlogApp!</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">This is a sample post. Start publishing your own blogs soon!</p>
              <span className="text-xs text-gray-400">Posted on 2024-06-01</span>
            </li>
            <li className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181818] shadow-sm">
              <h3 className="font-bold text-lg mb-1">Getting Started</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Click the 'Create Blog' button above to begin your blogging journey. (Feature coming soon!)</p>
              <span className="text-xs text-gray-400">Posted on 2024-05-30</span>
            </li>
          </ul>
        </section>
      </main>
      <footer className="mt-16 text-sm text-gray-400 text-center w-full">
        &copy; {new Date().getFullYear()} BlogApp. All rights reserved.
      </footer>
    </div>
  );
} 