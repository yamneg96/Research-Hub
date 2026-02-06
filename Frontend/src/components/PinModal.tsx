import { useState } from "react";

type PinModalProps = {
  isOpen: boolean;
  onSubmit: (pin: string) => void;
  errorMessage?: string;
  isLoading?: boolean;
};

const PinModal = ({ isOpen, onSubmit, errorMessage, isLoading }: PinModalProps) => {
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pin.length < 4) return;
    onSubmit(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101922]/60 backdrop-blur-md">
      <div className="relative w-full max-w-[420px] transform overflow-hidden rounded-2xl bg-white dark:bg-[#15202b] border border-slate-200 dark:border-[#2a3e50] p-8 text-left shadow-2xl transition-all sm:w-full">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#137fec] to-transparent opacity-70"></div>
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#137fec]/10 dark:bg-[#137fec]/20 ring-1 ring-[#137fec]/30">
            <span className="material-symbols-outlined text-[32px] text-[#137fec]">lock</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white">Enter Access PIN</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
              This document is classified. Please enter your 4-digit security PIN to view the full abstract.
            </p>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="pin">4-Digit PIN</label>
            <div className="relative flex items-center justify-center group">
              <div aria-hidden="true" className="absolute inset-0 flex gap-3 justify-center pointer-events-none">
                <div className="w-12 h-14 border border-slate-300 dark:border-[#324d67] rounded-lg bg-slate-50 dark:bg-[#1a2632] group-focus-within:border-[#137fec]/50 transition-colors"></div>
                <div className="w-12 h-14 border border-slate-300 dark:border-[#324d67] rounded-lg bg-slate-50 dark:bg-[#1a2632] group-focus-within:border-[#137fec]/50 transition-colors"></div>
                <div className="w-12 h-14 border border-slate-300 dark:border-[#324d67] rounded-lg bg-slate-50 dark:bg-[#1a2632] group-focus-within:border-[#137fec]/50 transition-colors"></div>
                <div className="w-12 h-14 border border-slate-300 dark:border-[#324d67] rounded-lg bg-slate-50 dark:bg-[#1a2632] group-focus-within:border-[#137fec]/50 transition-colors"></div>
              </div>
              <input
                id="pin"
                name="pin"
                type="password"
                autoComplete="one-time-code"
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
                className="block w-[240px] h-14 py-2 pl-[18px] text-left bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-0 text-2xl font-bold tracking-[2.6rem] z-10 font-mono text-center selection:bg-transparent"
                placeholder="••••"
              />
            </div>
            {errorMessage ? (
              <p className="mt-3 text-sm text-red-500 text-center">{errorMessage}</p>
            ) : null}
            <div className="flex flex-col w-full gap-3 mt-6">
              <button
                className="inline-flex w-full justify-center rounded-xl bg-[#137fec] px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#137fec] transition-all duration-200 disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Unlocking..." : "Unlock Research"}
              </button>
              <button
                className="inline-flex w-full justify-center rounded-xl bg-transparent px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                type="button"
                onClick={() => setPin("")}
              >
                Request Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
