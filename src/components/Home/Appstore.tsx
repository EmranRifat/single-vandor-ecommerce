import Image from "next/image";
import React from "react";
import { ArrowRight } from "lucide-react";

const AppStore = () => {
    return (
<section className="bg-gradient-to-br from-indigo-50 via-white to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 py-20 transition-colors duration-300">            <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:justify-between">
                {/* Left Content */}
                <div className="max-w-xl">
                    <h2 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white lg:text-4xl">
    Download, Search & <br />
    Book Your Perfect Place
</h2>

<p className="mt-5 text-md leading-8 text-slate-600 dark:text-slate-300">
    Download the Travela app to explore and manage your journeys anytime,
    anywhere.
</p>
                    {/* Store Buttons */}
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Image
                            src="/assets/button-app.svg"
                            alt="App Store"
                            width={170}
                            height={52}
                            className="cursor-pointer transition hover:scale-105"
                        />

                        <Image
                            src="/assets/googleplay.svg"
                            alt="Google Play"
                            width={170}
                            height={52}
                            className="cursor-pointer transition hover:scale-105"
                        />
                        <Image
                            src="/assets/download-section-curve.png"
                            alt="Google Play"
                            width={170}
                            height={52}
                            className="cursor-pointer transition hover:scale-105"
                        />

                    </div>

                    {/* QR */}
                    <div className="mt-10 ml-[75px]">
                        <Image
                            src="/assets/qr.png"
                            alt="QR Code"
                            width={170}
                            height={170}
                            className="rounded-lg border-4 border-pink-600"
                        />
                    </div>
                </div>
                {/* Right Image */}
                <div className="flex justify-center lg:justify-end">
                    <Image
                        src="/assets/app.svg"
                        alt="Travela App"
                        width={450}
                        height={450}
                        priority
                        className="
      h-auto
      w-[85%]
      max-w-[420px]
      lg:max-w-[450px]
      xl:max-w-[480px]

      animate-float
      transition-all
      duration-500
      ease-out

drop-shadow-[0_30px_60px_rgba(249,115,22,0.28)]   hover:scale-105
      hover:-rotate-2
      hover:[filter:drop-shadow(0_35px_70px_rgba(236,72,153,0.30))]
    "
                    />
                </div>
            </div>
        </section>
    );
};

export default AppStore;