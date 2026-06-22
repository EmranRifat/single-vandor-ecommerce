"use client"

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";






const ThemeToggler = ({ className }: { className?: string }) => {

    const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const storedTheme = window.localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemTheme;

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
            className={className || "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-postGreen text-white shadow-sm hover:bg-postGreenDark md:h-14 md:w-14"}
            aria-label={selectedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
            {selectedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-current md:h-6 md:w-6" />
            ) : (
                <Moon className="h-5 w-5 text-current md:h-6 md:w-6" />
            )}
        </button>
    );
};

export default ThemeToggler;
