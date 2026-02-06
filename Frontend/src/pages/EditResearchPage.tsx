import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LogOut } from "lucide-react";
import { fetchResearchById, updateResearch } from "../api/research";
import type { ResearchDocument } from "../types";
import ResearchForm, { type ResearchFormValues } from "../components/ResearchForm";
import NavControls from "../components/NavControls";

const EditResearchPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState<ResearchDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await fetchResearchById(id);
        setDocument(data);
      } catch (err) {
        setErrorMessage("Unable to load the document for editing.");
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (values: ResearchFormValues) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append("category", values.category);
      payload.append("content", values.content);
      if (values.pin) payload.append("pin", values.pin);
      if (values.thumbnail) payload.append("thumbnail", values.thumbnail);
      if (values.coverImage) payload.append("coverImage", values.coverImage);
      if (values.thumbnailFile) payload.append("thumbnail", values.thumbnailFile);
      if (values.coverFile) payload.append("coverImage", values.coverFile);

      await updateResearch(id, payload);
      navigate("/admin");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.message || "Unable to update this document. Please try again.");
      } else {
        setErrorMessage("Unable to update this document. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/admin/login");
  };

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white font-[Inter] min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-[#233648] bg-white dark:bg-[#101922]">
        <div className="px-6 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NavControls />
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="size-8 rounded-lg bg-[#137fec]/10 text-[#137fec] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">science</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight">Research Hub</h2>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              <Link className="text-slate-600 dark:text-[#92adc9] hover:text-[#137fec] dark:hover:text-white text-sm font-medium transition-colors" to="/">
                Dashboard
              </Link>
              <Link className="text-slate-600 dark:text-[#92adc9] hover:text-[#137fec] dark:hover:text-white text-sm font-medium transition-colors" to="/admin">
                My Documents
              </Link>
            </nav>
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

      <main className="flex-grow flex justify-center w-full px-4 py-8 md:py-12">
        <div className="w-full max-w-[1200px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#92adc9] mb-2">
              <Link className="hover:text-[#137fec]" to="/admin">Portfolio</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-900 dark:text-white font-medium">Edit Document</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Edit Research Document</h1>
            <p className="text-slate-500 dark:text-[#92adc9] text-base md:text-lg max-w-2xl">
              Update your findings, metadata, and access preferences.
            </p>
          </div>

          {errorMessage ? <div className="text-red-500 text-sm">{errorMessage}</div> : null}

          {document ? (
            <ResearchForm
              initialValues={document}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="text-slate-500 dark:text-[#92adc9]">Loading document...</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditResearchPage;
