import {
  CheckCircle2,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type HostSuccessPageProps = {
  searchParams?: {
    message?: string;
    title?: string;
  };
};

export default function HostSuccessPage({
  searchParams,
}: HostSuccessPageProps) {
  const message =
    searchParams?.message || "Host listing created successfully";
  const listingTitle = searchParams?.title || "Your listing";
  const balloons = [
    { left: "12%", top: "16%", color: "#fb7185", size: "64px" },
    { left: "72%", top: "10%", color: "#2dd4bf", size: "54px" },
    { left: "82%", top: "68%", color: "#f59e0b", size: "60px" },
    { left: "18%", top: "74%", color: "#38bdf8", size: "46px" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-100 text-gray-950">
      <section className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid min-h-[calc(100vh-64px)] w-full max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.16)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#69c48c] shadow-[0_22px_50px_rgba(105,196,140,0.28)]">
                <CheckCircle2 className="h-20 w-20 text-white" strokeWidth={2.5} />
              </div>

              <h1 className="mt-9 text-4xl font-bold tracking-normal text-gray-950 sm:text-5xl">
                Congratulations!
              </h1>

              <p className="mt-5 text-lg font-medium leading-8 text-gray-600 sm:text-xl">
                {message}. Your listing is ready for review and will be checked
                by our team before it goes live.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-14 min-w-40 items-center justify-center rounded-lg bg-[#5b67f1] px-7 text-base font-bold text-white shadow-[0_12px_28px_rgba(91,103,241,0.26)] transition hover:bg-[#4c57dc]"
                >
                  Go to Home
                </Link>
                <Link
                  href="/become-a-host"
                  className="inline-flex h-14 min-w-40 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-7 text-base font-bold text-gray-800 transition hover:bg-gray-50"
                >
                  <Home className="h-4 w-4" />
                  Host page
                </Link>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden bg-[linear-gradient(145deg,#111827_0%,#312e81_44%,#ec4899_100%)] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-16 left-6 h-56 w-56 rounded-full bg-teal-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0">
              {balloons.map((balloon) => (
                <div
                  key={`${balloon.left}-${balloon.top}`}
                  className="absolute"
                  style={{ left: balloon.left, top: balloon.top }}
                >
                  <div
                    className="relative rounded-full shadow-[inset_-10px_-14px_24px_rgba(15,23,42,0.2),0_18px_36px_rgba(15,23,42,0.18)]"
                    style={{
                      width: balloon.size,
                      height: `calc(${balloon.size} * 1.18)`,
                      background: balloon.color,
                    }}
                  >
                    <span className="absolute left-4 top-4 h-4 w-3 rounded-full bg-white/45 blur-[1px]" />
                    <span
                      className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[7px] border-r-[7px] border-t-[12px] border-l-transparent border-r-transparent"
                      style={{ borderTopColor: balloon.color }}
                    />
                    <span className="absolute left-1/2 top-[calc(100%+8px)] h-20 w-px -translate-x-1/2 bg-white/40" />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative flex h-full min-h-[520px] flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                  <Sparkles className="h-4 w-4 text-pink-100" />
                  New host journey started
                </div>

                <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-8 w-8 text-emerald-200" />
                </div>

                <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight tracking-normal">
                  Your listing is under review
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                  Thank you for submitting{" "}
                  <span className="font-bold text-white">{listingTitle}</span>.
                  Our team will review the property details, photos, location,
                  and pricing before publishing it for guests.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "We verify the listing information and location.",
                    "We review photos and amenities for guest clarity.",
                    "Once approved, the listing becomes available to guests.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-indigo-700">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-bold text-white">Review status</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Under review. You can continue browsing while we process your
                  submission.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
