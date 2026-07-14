"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggler = ({ className }: { className?: string }) => {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : systemTheme;

    setSelectedTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggsetSelectedTheme = () => {
    setSelectedTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      window.localStorage.setItem("theme", nextTheme);

      return nextTheme;
    });
  };

  return (
    <button
      type="button"
      onClick={toggsetSelectedTheme}
      className={
        className ||
        "flex h-9 gap-2 cursor-pointer items-center justify-center rounded-full bg-postGreen text-white shadow-sm hover:bg-postGreenDark px-3 py-1 md:h-14 md:gap-3 md:px-4"
      }
      aria-label={
        selectedTheme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
    >
      {selectedTheme === "dark" ? (
        <>
          <Sun className="h-4 w-4  md:h-5 md:w-5 text-amber-400" />
          <span className="text-sm px-2 text-gray-100">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-current md:h-5 md:w-5" />
          <span className="text-sm px-2 text-gray-700">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggler;
