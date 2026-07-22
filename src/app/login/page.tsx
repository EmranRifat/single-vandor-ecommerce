import Link from "next/link";
import LoginForm from "@/src/components/forms/LoginFrom";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 transition-colors duration-300 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </h1>

        <LoginForm />

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}