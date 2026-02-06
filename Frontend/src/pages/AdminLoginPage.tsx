import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";
import NavControls from "../components/NavControls";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("yamlaknegash96@gmail.com");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/admin";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await loginAdmin(email, password);
      localStorage.setItem("auth_token", data.token);
      setErrorMessage("");
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage("Invalid admin credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101922] text-white flex flex-col">
      <header className="w-full border-b border-[#233648]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NavControls />
            <Link className="text-sm font-semibold text-slate-200 hover:text-white transition-colors" to="/">
              Back to Dashboard
            </Link>
          </div>
          <span className="text-xs text-slate-400">Admin Sign In</span>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#15202b] border border-[#2a3e50] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#137fec]/10 ring-1 ring-[#137fec]/30">
            <span className="material-symbols-outlined text-[32px] text-[#137fec]">shield_lock</span>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-slate-400">Sign in to manage your research portfolio.</p>
          </div>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg bg-[#101922] border border-[#233648] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]/60"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg bg-[#101922] border border-[#233648] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]/60"
              required
            />
          </div>
          {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#137fec] hover:bg-blue-600 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
