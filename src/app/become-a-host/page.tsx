"use client";

import { ArrowRight, Phone, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import HostChatWidget from "@/src/components/host/HostChatWidget";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function BecomeAHostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleStartHosting = () => {
    const token = Cookies.get("token");

    if (!user && !token) {
      router.push("/login?redirect=/become-a-host/setup");
      return;
    }

    router.push("/become-a-host/setup");
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 text-gray-950">
      <section className="mx-auto flex min-h-[calc(80vh-50px)] max-w-5xl flex-col items-center justify-center pb-24 pt-4 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm">
          <Wallet className="h-4 w-4 text-gray-950" />
          <span>Start earning from your property today</span>
        </div>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight tracking-normal text-gray-950 sm:text-6xl lg:text-7xl">
          Turn Your Property Into{" "}
          <span className="block text-pink-500">Passive Income</span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-gray-700 sm:text-xl">
          Join thousands of successful hosts on StayNest. List your apartment,
          room, villa, or resort and start generating extra monthly income with
          our hassle-free platform.
        </p>

        <div className="mt-14 flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleStartHosting}
            disabled={loading}
            className="inline-flex h-16 w-full items-center justify-center gap-4 rounded-xl bg-pink-500 px-8 text-lg font-bold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            <Phone className="h-5 w-5" />
            Start Hosting Now
            <ArrowRight className="h-5 w-5" />
          </button>

          <HostChatWidget />
        </div>
      </section>
    </main>
  );
}
