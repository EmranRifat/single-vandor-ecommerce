"use client";

import { ArrowRight, Phone, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import HostChatWidget from "@/src/components/host/HostChatWidget";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LineParticles from "@/src/components/common/LineParticles";

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
<main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50 transition-all duration-500 dark:from-[#0b1120] dark:via-[#111827] dark:to-[#1e1b4b]">      <LineParticles />

      <section className="relative z-10 mx-auto flex min-h-[calc(80vh-50px)] max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white/90 px-5 py-3 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
          <Wallet className="h-4 w-4 text-pink-500 dark:text-pink-400" />
          <span>Start earning from your property today</span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight tracking-normal text-gray-900 transition-colors duration-300 sm:text-6xl lg:text-7xl dark:text-white">
          Turn Your Property Into{" "}
          <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
            Passive Income
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-gray-600 transition-colors duration-300 sm:text-xl dark:text-slate-300">
          Join thousands of successful hosts on StayNest. List your apartment,
          room, villa, or resort and start generating extra monthly income with
          our hassle-free platform.
        </p>

        {/* Actions */}
        <div className="mt-14 flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleStartHosting}
            disabled={loading}
            className="inline-flex h-16 w-full items-center justify-center gap-4 rounded-xl bg-pink-500 px-8 text-lg font-bold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:shadow-pink-500/40 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-pink-900/30 sm:w-auto"
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