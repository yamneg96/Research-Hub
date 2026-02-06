import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Upload } from "lucide-react";
import { fetchResearchList } from "../api/research";
import type { ResearchDocument } from "../types";
import { estimateReadTime, formatDate, truncate } from "../utils";
import ThemeToggle from "../components/ThemeToggle";
import NavControls from "../components/NavControls";

const fallbackImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDa9CeeBJbAXECuYBq1Y12e4fKGJyPGiSf_jXG01WvDs8Z3qO9H2DGiPpr2EDd0PJU06cxCWIFn0e5PPblYwTiFspyLxKJfu_qtyzy-7xaT8AWlPnuafUVVwKdeI12kJ61JpGC7kZdx7f64YQoUoqrLxq6ppyw2cQ1iyGp3Vg2DTNkZtjZzPgasnlFYVcon8boEu5Q_BBFcGXxFiZeAbVZkseXYgflEkGnbXA8Mx-PqqZFzWIKfAs2sAxaixCMV3NtA_ctST5Y_qDiR";

const DashboardPage = () => {
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("auth_token")));
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchResearchList(activeCategory);
        setDocuments(data);
        setError("");
      } catch (err) {
        setError("Unable to load research documents. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [activeCategory]);

  const categories = useMemo(() => {
    const unique = new Set(documents.map((doc) => doc.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    if (visibilityFilter === "public") {
      return documents.filter((doc) => !doc.pin);
    }
    if (visibilityFilter === "protected") {
      return documents.filter((doc) => doc.pin);
    }
    return documents;
  }, [documents, visibilityFilter]);

  const sortedDocuments = useMemo(() => {
    const sorted = [...filteredDocuments];
    if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    }
    if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      return sorted;
    }
    sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return sorted;
  }, [filteredDocuments, sortBy]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] font-[Inter] text-slate-900 dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#233648] bg-white/90 dark:bg-[#111a22]/90 backdrop-blur-md">
        <div className="px-6 md:px-10 py-3 mx-auto max-w-[1440px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <NavControls />
            <div className="flex items-center gap-3 text-[#137fec] dark:text-white">
              <span className="material-symbols-outlined text-3xl">science</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight hidden md:block">Research Hub</h2>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <Link className="text-slate-900 dark:text-white text-sm font-medium hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors" to="/">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center justify-end gap-4 flex-1 md:flex-initial">
            <div className="hidden md:flex items-center w-full max-w-[320px] h-10 rounded-lg bg-slate-100 dark:bg-[#233648] overflow-hidden focus-within:ring-2 focus-within:ring-[#137fec]/50 transition-shadow">
              <div className="pl-3 pr-2 text-slate-400 dark:text-[#92adc9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#92adc9] focus:ring-0 h-full py-0"
                placeholder="Search papers, authors..."
              />
            </div>
            <ThemeToggle />
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/create"
                  className="flex items-center gap-2 rounded-lg bg-[#137fec] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Link>
                <button
                  className="flex items-center gap-2 rounded-lg bg-[#233648] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2c445a] transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 rounded-lg bg-[#137fec] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        <section className="mb-10 rounded-3xl bg-white/70 dark:bg-[#141f2a] border border-slate-200/70 dark:border-[#223447] p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-[#92adc9]">Research Hub</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              A living library for your research notes, insights, and breakthroughs.
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-500 dark:text-[#92adc9]">
              Browse curated research highlights, deep dives, and documented experiments. Save what matters and publish new findings when you are ready.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/#research"
                className="rounded-lg bg-[#137fec] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
              >
                Explore Research
              </Link>
              {isLoggedIn ? (
                <Link
                  to="/create"
                  className="rounded-lg border border-[#233648] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white hover:bg-[#233648] hover:text-white transition-colors"
                >
                  Add Research
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="rounded-lg border border-[#233648] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white hover:bg-[#233648] hover:text-white transition-colors"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </section>

        <div id="research" className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Latest Research</h2>
              <p className="text-slate-500 dark:text-[#92adc9] text-base font-normal">Explore the newest additions to the Research Hub.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#233648] rounded-lg text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#2c445a] transition-colors"
                  type="button"
                  aria-expanded={filtersOpen}
                  onClick={() => {
                    setFiltersOpen((prev) => !prev);
                    setSortOpen(false);
                  }}
                >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filters
                </button>
                {filtersOpen ? (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-[#2a3e50] bg-white dark:bg-[#101922] shadow-xl p-3 z-20">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Visibility</p>
                    <div className="mt-2 flex flex-col gap-1">
                      <button
                        type="button"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${visibilityFilter === "all" ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2632]"}`}
                        onClick={() => {
                          setVisibilityFilter("all");
                          setFiltersOpen(false);
                        }}
                      >
                        All research
                        {visibilityFilter === "all" ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${visibilityFilter === "public" ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2632]"}`}
                        onClick={() => {
                          setVisibilityFilter("public");
                          setFiltersOpen(false);
                        }}
                      >
                        Public only
                        {visibilityFilter === "public" ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${visibilityFilter === "protected" ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2632]"}`}
                        onClick={() => {
                          setVisibilityFilter("protected");
                          setFiltersOpen(false);
                        }}
                      >
                        PIN protected
                        {visibilityFilter === "protected" ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#233648] rounded-lg text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#2c445a] transition-colors"
                  type="button"
                  aria-expanded={sortOpen}
                  onClick={() => {
                    setSortOpen((prev) => !prev);
                    setFiltersOpen(false);
                  }}
                >
                <span className="material-symbols-outlined text-[18px]">sort</span>
                Sort
                </button>
                {sortOpen ? (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-[#2a3e50] bg-white dark:bg-[#101922] shadow-xl p-3 z-20">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Order</p>
                    <div className="mt-2 flex flex-col gap-1">
                      <button
                        type="button"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${sortBy === "newest" ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2632]"}`}
                        onClick={() => {
                          setSortBy("newest");
                          setSortOpen(false);
                        }}
                      >
                        Newest first
                        {sortBy === "newest" ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${sortBy === "oldest" ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2632]"}`}
                        onClick={() => {
                          setSortBy("oldest");
                          setSortOpen(false);
                        }}
                      >
                        Oldest first
                        {sortBy === "oldest" ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                      </button>
                      <button
                        type="button"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${sortBy === "title" ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2632]"}`}
                        onClick={() => {
                          setSortBy("title");
                          setSortOpen(false);
                        }}
                      >
                        Title A-Z
                        {sortBy === "title" ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={
                  category === activeCategory
                    ? "flex-shrink-0 h-9 px-5 rounded-full bg-[#137fec] text-white text-sm font-medium shadow-md shadow-[#137fec]/20 transition-transform hover:scale-105"
                    : "flex-shrink-0 h-9 px-5 rounded-full bg-white dark:bg-[#233648] border border-slate-200 dark:border-transparent text-slate-600 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2c445a] transition-colors"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-slate-500 dark:text-[#92adc9]">Loading research feed...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDocuments.map((doc) => (
              <Link
                key={doc._id}
                to={`/research/${doc._id}`}
                className="group relative flex flex-col bg-white dark:bg-[#192633] rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${doc.thumbnail || doc.image || fallbackImage})` }}
                  ></div>
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-bold text-[#137fec] tracking-wide shadow-sm">
                      {doc.category || "Research"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-400 dark:text-[#92adc9]">{formatDate(doc.updatedAt)}</span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-xs font-medium text-slate-400 dark:text-[#92adc9]">{estimateReadTime(doc.content || doc.description)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-[#137fec] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {truncate(doc.description || doc.content, 140)}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9s14k0oT9xnTOD_fZorCJOGHt6HGsdqOuh4ETrVy323kRwqhOu9iUJ2ikXgeIYNTCJnbLFVqR2PSkEE_mF2tPaAlQpcl0Ft-9WvP5D-YXTa6ORcSmi7NlEmTj9Et-7ZOWYooicN3zLWkGeZpKdwaad2E9n0F45CcXwBf0gHfD-bdVeMgUHiZx57dqAi4rzB6WH5nRyVqcRlBM4FWKQfp2oZSRTyStgC0LfxLzFz5BIjLloXM_oOljIG4pCdQOWRooECpv9exvpjMG')" }}></div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Research Team</span>
                    </div>
                    <button className="text-slate-400 hover:text-[#137fec] transition-colors" type="button">
                      <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
