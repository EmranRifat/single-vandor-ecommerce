import Link from "next/link";
import RegisterForm from "@/src/components/forms/RegisterForm";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 transition-colors duration-300 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Register
        </h1>

        <Suspense fallback={<div>Loading form...</div>}>
          <RegisterForm />
        </Suspense>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Login here
          </Link>
        </p>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="colored"
      />
    </div>
  );
}