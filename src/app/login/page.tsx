import LoginForm from "@/src/components/login/loginFrom";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <LoginForm/>

      </div>

    </div>
  );
}