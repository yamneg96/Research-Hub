import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const handleToggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button
      className="flex items-center justify-center size-10 rounded-lg text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined">{isDark ? "light_mode" : "dark_mode"}</span>
    </button>
  );
};

export default ThemeToggle;
