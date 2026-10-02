import React, { useState } from 'react';
import { X, Cloud, Terminal, Check, Copy, ExternalLink, Zap, Shield, Globe } from 'lucide-react';

interface CloudflareGuideModalProps {
  onClose: () => void;
}

export const CloudflareGuideModal: React.FC<CloudflareGuideModalProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Build the Production Bundle',
      code: 'npm run build',
      explanation: 'Compiles the Vite + TypeScript + Tailwind bundle into an optimized static /dist directory.'
    },
    {
      title: 'Step 2: Deploy to Cloudflare Pages via Wrangler (Free)',
      code: 'npx wrangler pages deploy dist --project-name=ride-compare',
      explanation: 'Uploads directly to Cloudflare Pages. First time running this will ask you to login to your free Cloudflare account in the browser.'
    },
    {
      title: 'Alternative Method: Automatic Git Push Deploy',
      code: `git add .\ngit commit -m "Deploy RideCompare to Cloudflare"\ngit push origin main`,
      explanation: 'Connect your GitHub repo in Cloudflare Dashboard > Pages > Create a project. Set Build command: "npm run build" and Build output directory: "dist". It deploys automatically on every push!'
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 text-white rounded-2xl shadow-md">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Cloudflare Pages Free Deployment Guide
                <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  100% Free Forever
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlimited bandwidth, worldwide 300+ city edge CDN, free SSL & custom domain
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Cloudflare Benefits Pill Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-2xl border border-orange-200/60 dark:border-orange-900/40">
              <Zap className="w-4 h-4 text-orange-500 mb-1" />
              <p className="font-bold text-slate-800 dark:text-slate-200">Zero Cost</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Free tier covers unlimited requests</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200/60 dark:border-blue-900/40">
              <Globe className="w-4 h-4 text-blue-500 mb-1" />
              <p className="font-bold text-slate-800 dark:text-slate-200">Global CDN</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Sub-50ms latency across India & globe</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
              <Shield className="w-4 h-4 text-emerald-500 mb-1" />
              <p className="font-bold text-slate-800 dark:text-slate-200">Free SSL & Domain</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Automatic HTTPS & custom domain</p>
            </div>
          </div>

          {/* Configuration files already included notice */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              ✅ Pre-configured for Cloudflare Pages:
            </p>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">public/_redirects</code> — Handles client-side React SPA routing</li>
              <li>• <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">public/_headers</code> — Sets HTTP caching & security headers</li>
              <li>• <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">wrangler.toml</code> — Configured with output directory <code>dist</code></li>
            </ul>
          </div>

          {/* Interactive Steps */}
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </span>
                  <button
                    onClick={() => copyToClipboard(s.code, idx)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto my-2 border border-slate-800">
                  <pre>{s.code}</pre>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {s.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Open Cloudflare Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
