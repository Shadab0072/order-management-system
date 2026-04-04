import React, { useCallback, useState } from "react";

const WifiOffIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const Offline = () => {
  const [checking, setChecking] = useState(false);

  const handleRetry = useCallback(() => {
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 400);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060a12] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.18),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(251,191,36,0.08),transparent_45%)]" />

      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none text-[clamp(4rem,18vw,14rem)] font-extrabold tracking-tighter text-white/[0.04]">
        OFFLINE
      </p>

      <div className="absolute h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[100px] -top-24 -left-24" />
      <div className="absolute h-[360px] w-[360px] rounded-full bg-amber-500/10 blur-[90px] -bottom-20 -right-16" />

      <div className="relative z-10 mx-4 w-full max-w-md px-6 py-12 text-center">
        <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/20 opacity-40" />
          <span className="absolute h-28 w-28 rounded-full border border-cyan-400/30" />
          <span className="absolute h-20 w-20 rounded-full border border-amber-400/25" />
          <WifiOffIcon className="relative h-20 w-20 text-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]" />
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-widest text-cyan-200/90 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          No connection
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          You&apos;re offline
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          We can&apos;t reach the network right now. Check Wi‑Fi or mobile data,
          then try again — we&apos;ll reload as soon as you&apos;re back.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleRetry}
            disabled={checking}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a12] disabled:opacity-70 sm:w-auto"
          >
            {checking ? "Checking…" : "Try again"}
          </button>
          {/* <p className="text-xs text-slate-500">
            Tip: this page works without images — it loads from your app cache.
          </p> */}
        </div>

        <div className="mt-10 flex justify-center gap-1.5" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-1 w-6 rounded-full bg-white/10"
              style={{
                animation: "offline-bar 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes offline-bar {
          0%, 100% { opacity: 0.25; transform: scaleY(0.5); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default Offline;
