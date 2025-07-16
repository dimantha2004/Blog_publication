export default function Login() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#181818] p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form className="flex flex-col gap-4">
            <input type="email" placeholder="Email" className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-transparent" />
            <input type="password" placeholder="Password" className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-transparent" />
            <button type="submit" className="rounded-full bg-foreground text-background px-6 py-3 font-semibold text-lg shadow hover:bg-[#383838] dark:hover:bg-[#ccc] hover:text-foreground transition-colors mt-4" disabled>Login</button>
          </form>
        </div>
      </div>
    );
  } 