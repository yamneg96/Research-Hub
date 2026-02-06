import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchResearchById } from "../api/research";
import type { ResearchDocument } from "../types";
import { estimateReadTime, formatDate } from "../utils";
import PinModal from "../components/PinModal";
import { LogIn, LogOut, Upload } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import NavControls from "../components/NavControls";

const ResearchDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState<ResearchDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("auth_token")));
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  const loadDocument = async (pin?: string) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await fetchResearchById(id, pin);
      setDocument(data);
      setErrorMessage("");
      setPinModalOpen(false);
      setPinError("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        const fallback = pin ? "Invalid PIN. Please try again." : "This document requires a PIN.";
        const message = typeof err.response.data?.message === "string" ? err.response.data.message : fallback;
        setPinModalOpen(true);
        setPinError(message);
      } else {
        setErrorMessage("Unable to load this document. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(`bookmark_${id}`) === "true";
    setIsBookmarked(stored);
  }, [id]);

  const handlePinSubmit = async (pin: string) => {
    setPinLoading(true);
    await loadDocument(pin);
    setPinLoading(false);
  };

  const handlePinBack = () => {
    setPinModalOpen(false);
    setPinError("");
    setPinLoading(false);
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    navigate("/admin/login");
  };

  const handleBookmark = () => {
    if (!id) return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`bookmark_${id}`, String(next));
    setActionMessage(next ? "Saved to bookmarks." : "Removed from bookmarks.");
    setTimeout(() => setActionMessage(""), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document?.title, url });
        setActionMessage("Shared successfully.");
      } else {
        await navigator.clipboard.writeText(url);
        setActionMessage("Link copied to clipboard.");
      }
    } catch (error) {
      setActionMessage("Unable to share this link.");
    }
    setTimeout(() => setActionMessage(""), 2000);
  };

  const handleMoreAction = async (action: "copy" | "new") => {
    const url = window.location.href;
    if (action === "copy") {
      await navigator.clipboard.writeText(url);
      setActionMessage("Link copied to clipboard.");
    }
    if (action === "new") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setMenuOpen(false);
    setTimeout(() => setActionMessage(""), 2000);
  };

  const toc = useMemo(() => {
    if (!document?.content) {
      return { headings: [], html: "" };
    }
    const parser = new DOMParser();
    const parsed = parser.parseFromString(document.content, "text/html");
    const headings = Array.from(parsed.querySelectorAll("h2")).map((heading) => {
      const text = heading.textContent?.trim() || "";
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 48);
      heading.id = slug || `section-${Math.random().toString(36).slice(2, 8)}`;
      return { id: heading.id, label: text };
    });
    return { headings, html: parsed.body.innerHTML };
  }, [document?.content]);

  if (isLoading && !document) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 dark:text-slate-400">Loading document...</div>;
  }

  if (errorMessage && !document) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{errorMessage}</div>;
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white">
        <div className="min-h-screen" />
        <PinModal
          isOpen={pinModalOpen}
          onSubmit={handlePinSubmit}
          onBack={handlePinBack}
          errorMessage={pinError}
          isLoading={pinLoading}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-[Inter] text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <NavControls />
              <div className="flex items-center gap-3">
                <div className="size-8 text-[#137fec]">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="hidden md:block text-lg font-bold tracking-tight text-slate-900 dark:text-white">Research Hub</h2>
              </div>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-[#137fec] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="block w-full rounded-lg border-0 bg-slate-100 dark:bg-[#182635] py-2 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-[#137fec] placeholder:text-slate-500 dark:placeholder:text-slate-400 sm:text-sm sm:leading-6 transition-all"
                  placeholder="Search documents, data, & insights..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden lg:flex items-center gap-6">
                <Link className="text-sm font-medium text-slate-600 hover:text-[#137fec] dark:text-slate-300 dark:hover:text-white transition-colors" to="/">
                  Documents
                </Link>
              </nav>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block"></div>
              <ThemeToggle />
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    className="flex items-center gap-2 bg-[#137fec] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-[#137fec]/20"
                    to="/create"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
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
                  className="flex items-center gap-2 bg-[#137fec] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-[#137fec]/20"
                  to="/admin/login"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">On this page</h3>
              <ul className="space-y-3 border-l border-slate-200 dark:border-slate-800">
                <li>
                  <a className="block pl-4 text-sm font-medium text-[#137fec] border-l-2 border-[#137fec] -ml-[1px]" href="#summary">Executive Summary</a>
                </li>
                {toc.headings.map((heading) => (
                  <li key={heading.id}>
                    <a className="block pl-4 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" href={`#${heading.id}`}>
                      {heading.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-slate-100 dark:bg-[#182635] rounded-xl">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Contributors</p>
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#182635]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVLWnSY3DlMGZiFzFOJ8M9wH59hWnNaGVK7VPL5MCDz9G6gwjC2jE7MsMAobyJa9Zw9R1uYTVCiitm9FJmE1_2MN7yYgEKoiku9505VJarYarhkpJTK9LVZqrzWAjMsWsacH-ytab0L2br6jXUcNlCEDg1TepNDuA1pvvZC1i00bJ93YPZ4vSUoNr0e2_LKhlexQ26lk7R3n97MbrbXQCXs351EAWGIlxIZ0VUbnhZ-WcPOR1mDsFTtEeCZm9gJ5RhSrj3AZWyrvkN" alt="Contributor" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#182635]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP8B9A_XHMJ1TMdAu4iKU89lHmBH2BgMU6Uh4ymYk0BhVynaJhCXAzC9IRqqSLHuQXc62QKwGP4YmirvNlpuefOzjbi22ic0U6IW8XtxtFd-4po03vSKyE1b-CjYfdpuLzV8O7RB6OwCDEQjenTC18950CqwiIlhUA9SMahJm_vcUiUe005rIUTpBjdlXMAaoUTZrSmNUaSe69MhZ9YjubMhMlfhLet_MAPR3Dp2yjYGLj5yfyXQwYBYUfqghovxYCuctZ1cySKFkP" alt="Contributor" />
                  <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#182635] bg-slate-200 dark:bg-slate-700 text-xs font-medium text-slate-500 dark:text-slate-300">+3</div>
                </div>
              </div>
            </div>
          </aside>

          <article className="flex-1 min-w-0 max-w-[800px] mx-auto">
            <div className="flex items-center flex-wrap gap-2 mb-6 text-sm">
              <Link className="text-slate-500 hover:text-[#137fec] dark:text-slate-400 transition-colors" to="/">
                Research
              </Link>
              <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
              <span className="text-slate-500 hover:text-[#137fec] dark:text-slate-400 transition-colors">{document.category}</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
              <span className="font-medium text-slate-900 dark:text-white">Detail</span>
            </div>
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                {document.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-2">
                  <img className="size-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ8N_kE1ZEiLOD8X3EKWCjnE-GLY0X4_5GFoZmHKdUGPqzKAvlx2ewGEAB28AMySvvJ3QIkQhhgP92mrw0LiCu_xIuimTwhe6fSA3SAh9q8zMQjS6BRinbA-IBH5SzyDxJoqMuj0kid0nAw3nHTqGHorXJsdNmsnu8LuYAKHqgT3eyTZvoeTYu2jY5MG7fM43UA2r7ugXKkNJTFeK6vNGvCRWCdx4gLclqVWWcqRxoTWz4Jxm-XKKW3Zi9KAF9cHdSie0deXX_PDU9" alt="Author" />
                  <span className="font-medium text-slate-900 dark:text-white">Research Hub</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>{formatDate(document.updatedAt)}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>{estimateReadTime(document.content)}</span>
                </div>
                <div className="ml-auto flex items-center gap-2 relative">
                  <button
                    className="p-2 text-slate-400 hover:text-[#137fec] dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={handleBookmark}
                    aria-label="Bookmark"
                  >
                    <span className="material-symbols-outlined text-[20px]">{isBookmarked ? "bookmark" : "bookmark_add"}</span>
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-[#137fec] dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-[#137fec] dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="More"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                  {menuOpen ? (
                    <div className="absolute right-0 top-12 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101922] shadow-xl p-2 text-sm">
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => handleMoreAction("copy")}
                      >
                        Copy link
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => handleMoreAction("new")}
                      >
                        Open in new tab
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </header>
            {document.coverImage ? (
              <figure className="my-10 rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-[#182635]">
                <div className="relative aspect-video w-full">
                  <img alt="Cover" className="object-cover w-full h-full" src={document.coverImage} />
                </div>
              </figure>
            ) : null}
            <div className="prose-content text-slate-600 dark:text-slate-300 text-lg">
              <p className="lead text-xl md:text-2xl text-slate-900 dark:text-slate-100 font-normal mb-8" id="summary">
                {document.description}
              </p>
              <div
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: toc.html || document.content }}
              ></div>
            </div>
            {actionMessage ? (
              <div className="mt-4 text-sm text-[#137fec]">{actionMessage}</div>
            ) : null}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-[#182635] text-slate-600 dark:text-slate-300 text-sm rounded-full hover:bg-[#137fec]/10 hover:text-[#137fec] cursor-pointer transition-colors">#Research</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-[#182635] text-slate-600 dark:text-slate-300 text-sm rounded-full hover:bg-[#137fec]/10 hover:text-[#137fec] cursor-pointer transition-colors">#Insights</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-[#182635] text-slate-600 dark:text-slate-300 text-sm rounded-full hover:bg-[#137fec]/10 hover:text-[#137fec] cursor-pointer transition-colors">#{document.category?.replace(/\s+/g, "")}</span>
              </div>
            </div>
          </article>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 p-2 bg-white/90 dark:bg-[#182635]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full shadow-2xl transition-all hover:scale-105">
        <a aria-label="Buy Me a Coffee" className="group relative flex items-center justify-center p-3 rounded-full hover:bg-[#FFDD00]/20 transition-colors" href="https://www.buymeacoffee.com">
          <svg className="size-5 fill-slate-500 dark:fill-slate-400 group-hover:fill-[#FFDD00] transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.216 6.415l-.132-.666c-.119-.596-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.085-2.75.37-.36.118-.733.211-1.053.435-.196.137-.47.151-.704.288-.222.13-.354.384-.506.586-.145.193-.242.426-.353.642-.23.447-.298.966-.413 1.454-.127.534-.233 1.077-.355 1.614-.144.646-.43 1.25-.664 1.868-.09.237-.16.486-.214.737-.103.483.037.994.398 1.346.33.321.782.476 1.233.567.57.114 1.157.126 1.733.153.228.01.458.01.686.014.225.004.453.003.679.003h.34c-.035.18-.088.358-.168.524-.265.55-.724.966-1.257 1.24-.595.306-1.29.378-1.92.203-.223-.062-.486-.062-.646-.246-.142-.163-.153-.404-.15-.615.005-.353.064-.698.156-1.036.04-.143.085-.285.093-.434.004-.085-.02-.17-.058-.247-.055-.11-.144-.195-.236-.27-.225-.183-.506-.282-.786-.334-.737-.136-1.503-.075-2.227.132-.38.109-.773.225-1.082.466-.233.18-.42.46-.435.759-.009.186.06.366.152.525.163.278.41.493.68.65.54.316 1.156.452 1.77.51.52.05 1.045.034 1.56.126.33.059.646.195.918.406.402.312.698.74.857 1.218.175.525.2.946.02 1.488-.063.19-.158.373-.284.523-.314.37-.738.583-1.186.735-1.045.352-2.185.34-3.238.125-.568-.116-1.11-.322-1.636-.575-.55-.265-1.045-.63-1.464-1.096-.28-.31-.518-.67-.643-1.076-.113-.37-.16-.763-.092-1.146.04-.223.11-.437.214-.634.19-.36.49-.637.852-.806.435-.203.92-.258 1.392-.257.653 0 1.298.118 1.905.342.303.11.62.19.95.145.345-.046.61-.31.758-.61.127-.26.155-.56.157-.847.004-.576-.076-1.15-.226-1.706-.115-.425-.28-.836-.52-1.203-.275-.42-.656-.757-1.107-.97-.56-.264-1.183-.356-1.794-.373-1.03-.03-2.062.03-3.088.16-.48.06-1.03.113-1.403.456-.277.255-.42.613-.5.973-.04.18-.06.363-.06.547v.085c0 .546.103 1.087.276 1.597.237.7.67 1.31 1.233 1.776.545.45 1.196.764 1.875.952.82.227 1.673.298 2.52.28 1.16-.025 2.31-.19 3.428-.53 1.35-.41 2.585-1.144 3.59-2.137.957-.946 1.675-2.096 2.06-3.39.26-.874.34-1.8.204-2.705-.09-.607-.272-1.198-.558-1.745-.37-.71-.91-1.306-1.59-1.724-.318-.195-.658-.35-1.012-.452-.355-.102-.73-.122-1.096-.063-.38.06-.723.235-1.02.484-.23.193-.414.444-.564.708-.197.346-.308.74-.38 1.134-.085.46-.14 1.04-.51 1.365-.213.187-.514.237-.783.21-.295-.03-.56-.16-.775-.36-.26-.24-.39-.586-.466-.925-.13-.586-.14-1.195-.084-1.79.03-.32.093-.635.215-.928.14-.34.364-.633.646-.86.377-.303.84-.46 1.315-.526.634-.088 1.272-.032 1.9.06 1.48.217 2.87.896 3.97 1.94 1.21 1.15 2.03 2.68 2.37 4.31.18.86.224 1.746.115 2.623-.053.42-.136.837-.288 1.235-.11.284-.25.56-.445.8Z"></path></svg>
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Buy Me a Coffee</span>
        </a>
        <a aria-label="Upwork" className="group relative flex items-center justify-center p-3 rounded-full hover:bg-[#6FDA44]/20 transition-colors" href="https://www.upwork.com">
          <svg className="size-5 fill-slate-500 dark:fill-slate-400 group-hover:fill-[#6FDA44] transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-7.347c-2.548 0-4.61 2.062-4.61 4.609 0 .63.127 1.23.356 1.787l-.753 3.543c-1.618-4.674-1.555-7.895-1.555-7.912v-.136c0-.797-1.075-.798-1.075-.001v5.405c-2.214-1.485-2.612-4.14-2.612-4.159v-1.245c0-.797-1.075-.798-1.075-.001v1.245c0 .044.425 2.611 2.975 4.592l-2.975 1.395c-.37.173-.231.75.176.75h.033c.171 0 .341-.093.428-.275l3.204-1.503c.531 1.86 1.272 3.544 2.118 4.791.242.357.513.673.799.94l-.872 4.097c-.075.353.194.693.551.693.078 0 .157-.016.23-.05.414-.191.603-.681.411-1.096l-.99-2.115c.571.226 1.157.345 1.745.345 3.605 0 6.518-2.912 6.518-6.517 0-3.602-2.913-6.514-6.518-6.514z"></path></svg>
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Upwork</span>
        </a>
        <a aria-label="LinkedIn" className="group relative flex items-center justify-center p-3 rounded-full hover:bg-[#0077B5]/20 transition-colors" href="https://www.linkedin.com">
          <svg className="size-5 fill-slate-500 dark:fill-slate-400 group-hover:fill-[#0077B5] transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">LinkedIn</span>
        </a>
        <a aria-label="Twitter" className="group relative flex items-center justify-center p-3 rounded-full hover:bg-slate-900/10 dark:hover:bg-white/20 transition-colors" href="https://x.com">
          <svg className="size-5 fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-900 dark:group-hover:fill-white transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Twitter</span>
        </a>
      </div>

      <PinModal
        isOpen={pinModalOpen}
        onSubmit={handlePinSubmit}
        onBack={handlePinBack}
        errorMessage={pinError}
        isLoading={pinLoading}
      />
    </div>
  );
};

export default ResearchDetailPage;
