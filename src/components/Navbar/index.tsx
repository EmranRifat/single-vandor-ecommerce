"use client";

import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/dictionaries/dictionaty";
import { useAuth } from "@/lib/auth-context";
import Cookies from "js-cookie";
import enDictionary from "@/dictionaries/en.json";
import bnDictionary from "@/dictionaries/bn.json";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggler from "./ThemeToggler";
import SearchBar from "../Products/SearchBar";

export default function Navbar() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lang = (Cookies.get("lang") === "bn" ? "bn" : "en") as Locale;
  const dictionary = lang === "bn" ? bnDictionary : enDictionary;
  const { common, login } = dictionary;

  const nextLang: Locale = lang === "bn" ? "en" : "bn";
  const nextLangLabel = nextLang === "bn" ? "Bangla" : "English";
  const userInitial = (user?.name?.trim() || user?.email?.trim() || "E")
    .slice(0, 1)
    .toUpperCase();

  const toggleLanguage = () => {
    Cookies.set("lang", nextLang);
    window.location.reload();
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("access");
    Cookies.remove("refresh");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="relative z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center py-3 sm:hidden">
          <Image
            src="/static/images/logo/logo-icon-dark.svg"
            alt="logo"
            width={40}
            height={30}
            className=""
          />

          <p className="ml-2 w-full text-start ss:text-md xxs:text-md xs:text-xl sm:text-xl md:text-2xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
            {common.logo_text}
          </p>
        </Link>

        <Link
          href="/dashboard"
          className="hidden min-w-0 shrink-0 items-center py-3 sm:flex"
        >
          <Image
            src="/static/images/logo/logo-icon-dark.svg"
            alt="logo"
            width={40}
            height={30}
            className=""
          />

          <p
            className={`ml-2 w-full text-start ${
              lang == "bn" ? "ss:text-2xl" : "ss:text-md"
            } ${lang == "bn" ? "xxs:text-2xl" : "xxs:text-md"} ${
              lang == "bn" ? "xs:text-2xl" : "xs:text-xl"
            }  sm:text-xl md:text-2xl lg:text-2xl font-semibold text-gray-900 dark:text-white`}
          >
            {common.logo_text}
          </p>
        </Link>
        <div  className="mx-auto max-w-4xl px-6 lg:px-10">
          <SearchBar />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/become-a-host"
            className="hidden rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg sm:block"
          >
            Become a host
          </Link>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition-all duration-200 hover:shadow-md"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-semibold leading-none text-white">
                {userInitial}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Menu className="h-5 w-5" />
              </span>
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="w-full rounded-md px-3 py-2 text-left text-gray-800 hover:bg-gray-50"
                >
                  Language: {nextLangLabel}
                </button>
                <ThemeToggler className="mt-2 flex w-full items-center bg-gray-100 rounded-md px-3 py-2 text-left text-postGreen hover:bg-gray-50" />

                <div className="my-3 h-px bg-gray-100" />

                {loading ? (
                  <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
                ) : !user ? (
                  <div className="flex w-full flex-col gap-2">
                    <Link
                      className="w-full rounded-lg bg-blue-500 px-4 py-3 text-center text-white"
                      href="/login"
                    >
                      {login.login_label}
                    </Link>
                    {/* <Link
                      className="w-full rounded-lg bg-gray-900 px-4 py-3 text-center text-white"
                      href="/register"
                    >
                      {login.signup}
                    </Link> */}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                    >
                      {login.log_out || "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {!isMenuOpen ? (
        <div className="border-t border-gray-100 px-2 py-2.5 sm:px-4 md:hidden">
          <SearchBar />
        </div>
      ) : null}
    </nav>
  );
}
