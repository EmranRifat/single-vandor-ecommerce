import RegisterForm from "@/src/components/forms/RegisterForm";
import { ToastContainer } from "react-toastify";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Register </h1>

        <RegisterForm />

        <p className="text-gray-700 text-sm mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
