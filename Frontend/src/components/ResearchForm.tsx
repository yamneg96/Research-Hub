import { useEffect, useMemo, useState } from "react";
import type { ResearchDocument } from "../types";

export type ResearchFormValues = {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  coverImage: string;
  content: string;
  pin?: string;
  thumbnailFile?: File | null;
  coverFile?: File | null;
};

type ResearchFormProps = {
  initialValues?: Partial<ResearchDocument>;
  onSubmit: (values: ResearchFormValues) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
};

const ResearchForm = ({ initialValues, onSubmit, submitLabel, isSubmitting }: ResearchFormProps) => {
  const defaults = useMemo(
    () => ({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      category: initialValues?.category ?? "",
      thumbnail: initialValues?.thumbnail ?? initialValues?.image ?? "",
      coverImage: initialValues?.coverImage ?? "",
      content: initialValues?.content ?? "",
      pin: initialValues?.pin ?? ""
    }),
    [initialValues]
  );

  const [values, setValues] = useState<ResearchFormValues>(defaults);
  const [pinEnabled, setPinEnabled] = useState(Boolean(defaults.pin));
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(defaults.thumbnail);
  const [coverPreview, setCoverPreview] = useState(defaults.coverImage);

  useEffect(() => {
    setValues(defaults);
    setPinEnabled(Boolean(defaults.pin));
    setThumbnailFile(null);
    setCoverFile(null);
    setThumbnailPreview(defaults.thumbnail);
    setCoverPreview(defaults.coverImage);
  }, [defaults]);

  useEffect(() => {
    if (!thumbnailFile) return undefined;
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  useEffect(() => {
    if (!coverFile) return undefined;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const handleChange = (field: keyof ResearchFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...values,
      pin: pinEnabled ? values.pin : "",
      thumbnailFile,
      coverFile
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-gray-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="title">Document Title</label>
                <input
                  id="title"
                  value={values.title}
                  onChange={handleChange("title")}
                  className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#92adc9] transition-all"
                  placeholder="e.g., Quantum Entanglement in Macroscopic Systems"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="description">Abstract / Description</label>
                <textarea
                  id="description"
                  value={values.description}
                  onChange={handleChange("description")}
                  className="w-full min-h-[160px] p-4 rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#92adc9] resize-y transition-all"
                  placeholder="Provide a comprehensive summary of your research methodology and findings..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="category">Category</label>
                  <div className="relative">
                    <select
                      id="category"
                      value={values.category}
                      onChange={handleChange("category")}
                      className="w-full h-12 px-4 appearance-none rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] transition-all"
                      required
                    >
                      <option value="" disabled>Select Field</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Quantum Physics">Quantum Physics</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Astrophysics">Astrophysics</option>
                      <option value="Energy Sector">Energy Sector</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="thumbnail">Thumbnail URL</label>
                  <input
                    id="thumbnail"
                    value={values.thumbnail}
                    onChange={handleChange("thumbnail")}
                    className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#92adc9] transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="coverImage">Cover Image URL</label>
                <input
                  id="coverImage"
                  value={values.coverImage}
                  onChange={handleChange("coverImage")}
                  className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#92adc9] transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="content">Research Content (HTML or Markdown)</label>
                <textarea
                  id="content"
                  value={values.content}
                  onChange={handleChange("content")}
                  className="w-full min-h-[220px] p-4 rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] placeholder:text-slate-400 dark:placeholder:text-[#92adc9] resize-y transition-all"
                  placeholder="Paste the full research document content here..."
                  required
                />
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-[#233648]/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">lock</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Restricted Access</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#92adc9]">Enable to require a PIN for viewing this document.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={pinEnabled}
                      onChange={(event) => setPinEnabled(event.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#137fec]/30 dark:peer-focus:ring-[#137fec]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#137fec]"></div>
                  </label>
                </div>
                {pinEnabled ? (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Access PIN</label>
                    <input
                      value={values.pin}
                      onChange={handleChange("pin")}
                      className="w-full md:w-1/2 h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec] tracking-widest placeholder:tracking-normal"
                      maxLength={6}
                      placeholder="Enter 4-6 digits"
                      type="password"
                      inputMode="numeric"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-gray-200 dark:border-[#233648] p-6 md:p-8 shadow-sm h-fit">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 block">Cover Image</label>
            <div className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-[#233648] rounded-xl bg-slate-50/50 dark:bg-[#101922]/30 hover:bg-[#137fec]/5 hover:border-[#137fec] dark:hover:border-[#137fec]/50 transition-all cursor-pointer">
              <input
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                {coverPreview ? (
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <img src={coverPreview} alt="Cover preview" className="w-full h-44 object-cover rounded-xl" />
                  </div>
                ) : (
                  <>
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-[#101922] text-[#137fec] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                    </div>
                    <p className="mb-2 text-sm text-slate-900 dark:text-white font-medium">
                      <span className="text-[#137fec] font-bold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#92adc9]">JPG, PNG, or WEBP (MAX. 5MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-gray-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 block">Thumbnail Image</label>
            <div className="flex gap-4 items-start">
              <div className="relative shrink-0 size-24 md:size-32 rounded-lg bg-slate-100 dark:bg-[#101922] border border-gray-200 dark:border-[#233648] overflow-hidden flex items-center justify-center group">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300 dark:text-[#233648] text-4xl">image</span>
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-white">edit</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3 h-full pt-1">
                <p className="text-xs text-slate-500 dark:text-[#92adc9] leading-relaxed">
                  Upload a cover image to make your research stand out in the feed.
                  <br />Recommended: 1200x630px.
                </p>
                <label className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-white bg-white dark:bg-[#233648] border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors w-fit">
                  Choose Image
                  <input
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 py-6 mt-4 border-t border-gray-200 dark:border-[#233648]">
        <button
          type="button"
          className="px-6 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-lg bg-[#137fec] hover:bg-[#137fec]/90 text-white text-sm font-bold shadow-lg shadow-[#137fec]/20 transition-all flex items-center gap-2 disabled:opacity-60"
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined text-lg">publish</span>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ResearchForm;
