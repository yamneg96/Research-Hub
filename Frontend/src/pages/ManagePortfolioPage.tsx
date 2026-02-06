import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Plus, UserCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { deleteResearch, fetchResearchList } from "../api/research";
import type { ResearchDocument } from "../types";
import { formatDate } from "../utils";
import NavControls from "../components/NavControls";

const ManagePortfolioPage = () => {
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Documents");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await fetchResearchList();
      setDocuments(data);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Unable to load your portfolio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this research document? This cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteResearch(id);
      await loadDocuments();
    } catch (err) {
      setErrorMessage("Unable to delete the document. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/admin/login");
  };

  const filteredDocuments = useMemo(() => {
    if (activeFilter === "Published") {
      return documents.filter((doc) => !doc.pin);
    }
    if (activeFilter === "Drafts") {
      return documents.filter((doc) => doc.pin);
    }
    if (activeFilter === "Archived") {
      return [];
    }
    return documents;
  }, [activeFilter, documents]);

  const sortedDocuments = useMemo(() => {
    const sorted = [...filteredDocuments];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    }
    if (sortBy === "views") {
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      return sorted;
    }
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  }, [filteredDocuments, sortBy]);

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-[Inter] text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid dark:border-[#233648] border-slate-200 bg-white dark:bg-[#1a2632] px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <NavControls />
          <div className="flex items-center gap-4 dark:text-white text-slate-900">
            <div className="size-8 text-[#137fec]">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
              </svg>
            </div>
            <h2 className="dark:text-white text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Research Hub</h2>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden lg:flex items-center gap-9">
            <Link className="text-slate-600 dark:text-slate-300 hover:text-[#137fec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" to="/">
              Dashboard
            </Link>
            <Link className="text-[#137fec] dark:text-white text-sm font-medium leading-normal" to="/admin">
              My Portfolio
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#233648] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#233648] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" aria-label="Profile">
              <UserCircle className="h-5 w-5" />
            </button>
            <button
              className="flex items-center gap-2 rounded-lg bg-[#233648] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2c445a] transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-10 py-8 flex justify-center">
        <div className="flex flex-col max-w-[1200px] flex-1 w-full gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-[#92adc9]">
                <span>Home</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-[#137fec] dark:text-white font-medium">Portfolio</span>
              </div>
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Manage Research Portfolio</h1>
              <p className="text-slate-500 dark:text-[#92adc9] text-base font-normal leading-normal max-w-2xl">
                Oversee and update your published research documents. Manage visibility and track performance from a centralized hub.
              </p>
            </div>
            <button
              className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-blue-500/20"
              onClick={() => navigate("/create")}
            >
              <Plus className="h-4 w-4" />
              <span className="whitespace-nowrap">Add New Research</span>
            </button>
          </div>

          {errorMessage ? <div className="text-red-500 text-sm">{errorMessage}</div> : null}

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#233648] shadow-sm">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {["All Documents", "Published", "Drafts", "Archived"].map((label) => (
                <button
                  key={label}
                  className={
                    label === activeFilter
                      ? "px-4 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec] font-medium text-sm whitespace-nowrap"
                      : "px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#233648] text-slate-600 dark:text-[#92adc9] font-medium text-sm whitespace-nowrap transition-colors"
                  }
                  onClick={() => setActiveFilter(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">filter_list</span>
                <select
                  className="pl-9 pr-8 py-2 w-full md:w-40 bg-slate-50 dark:bg-[#101922] border border-slate-200 dark:border-[#233648] rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#137fec]/50"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="views">Sort by Views</option>
                </select>
              </div>
            </div>
          </div>

          <div className="@container w-full">
            <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#192633] border-b border-slate-200 dark:border-[#233648]">
                      <th className="px-6 py-4 text-left text-slate-900 dark:text-white text-xs font-semibold uppercase tracking-wider w-[35%]">Title</th>
                      <th className="px-6 py-4 text-left text-slate-900 dark:text-white text-xs font-semibold uppercase tracking-wider w-[15%]">Date Created</th>
                      <th className="px-6 py-4 text-left text-slate-900 dark:text-white text-xs font-semibold uppercase tracking-wider w-[15%]">Category</th>
                      <th className="px-6 py-4 text-left text-slate-900 dark:text-white text-xs font-semibold uppercase tracking-wider w-[15%]">Visibility</th>
                      <th className="px-6 py-4 text-right text-slate-900 dark:text-white text-xs font-semibold uppercase tracking-wider w-[20%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#233648]">
                    {isLoading ? (
                      <tr>
                        <td className="px-6 py-6 text-slate-500 dark:text-[#92adc9]" colSpan={5}>Loading documents...</td>
                      </tr>
                    ) : sortedDocuments.length === 0 ? (
                      <tr>
                        <td className="px-6 py-6 text-slate-500 dark:text-[#92adc9]" colSpan={5}>No documents match this filter yet.</td>
                      </tr>
                    ) : (
                      sortedDocuments.map((doc) => (
                        <tr key={doc._id} className="hover:bg-slate-50 dark:hover:bg-[#101922] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#137fec] shrink-0">
                                <span className="material-symbols-outlined">description</span>
                              </div>
                              <div>
                                <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">{doc.title}</p>
                                <p className="text-slate-500 dark:text-[#92adc9] text-xs mt-0.5">ID: #{doc._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600 dark:text-slate-300 text-sm">{formatDate(doc.createdAt)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                              {doc.category || "General"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`size-2 rounded-full ${doc.pin ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                              <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                                {doc.pin ? "PIN Protected" : "Public"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-2 rounded-lg text-slate-400 hover:text-[#137fec] hover:bg-[#137fec]/10 transition-colors"
                                title="Edit"
                                onClick={() => navigate(`/admin/edit/${doc._id}`)}
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Delete"
                                onClick={() => handleDelete(doc._id)}
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#1a2632]/50">
                <div className="text-sm text-slate-500 dark:text-[#92adc9]">Showing <span className="font-semibold text-slate-900 dark:text-white">1-{sortedDocuments.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{sortedDocuments.length}</span></div>
                <div className="flex items-center gap-2">
                  <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:bg-slate-50 dark:hover:bg-[#233648] text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50">
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button className="flex size-8 items-center justify-center rounded-lg bg-[#137fec] text-white text-sm font-medium">1</button>
                  <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:bg-slate-50 dark:hover:bg-[#233648] text-slate-600 dark:text-slate-300 transition-colors text-sm">2</button>
                  <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:bg-slate-50 dark:hover:bg-[#233648] text-slate-600 dark:text-slate-300 transition-colors text-sm">3</button>
                  <span className="text-slate-400">...</span>
                  <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:bg-slate-50 dark:hover:bg-[#233648] text-slate-600 dark:text-slate-300 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagePortfolioPage;
