import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavControls = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="flex items-center justify-center size-9 rounded-lg border border-slate-200/70 dark:border-[#233648] text-slate-500 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="flex items-center justify-center size-9 rounded-lg border border-slate-200/70 dark:border-[#233648] text-slate-500 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors"
        onClick={() => navigate(1)}
        aria-label="Go forward"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default NavControls;
