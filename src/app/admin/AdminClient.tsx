"use client";

import { useState } from "react";
import LoginGate from "./LoginGate";
import ServicesTab from "./tabs/ServicesTab";
import GalleryTab from "./tabs/GalleryTab";
import TestimonialsTab from "./tabs/TestimonialsTab";

export type AdminTab = "services" | "gallery" | "testimonials";

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: "services", label: "Services & Prices", icon: "✂️" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
  { id: "testimonials", label: "Testimonials", icon: "⭐" },
];

type PublishState = "idle" | "loading" | "success" | "error";

const GITHUB_OWNER = "logeshOfficial";
const GITHUB_REPO = "legendsviziltisalon";
const GITHUB_BRANCH = "master";

export default function AdminClient() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("services");
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishError, setPublishError] = useState("");

  async function handlePublish() {
    setPublishState("loading");
    setPublishError("");

    const ghToken = process.env.NEXT_PUBLIC_GITHUB_DEPLOY_TOKEN;

    if (!ghToken) {
      setPublishError(
        "NEXT_PUBLIC_GITHUB_DEPLOY_TOKEN is not set. Add it to your environment variables.",
      );
      setPublishState("error");
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_type: "manual-publish" }),
        },
      );

      if (res.status === 204) {
        setPublishState("success");
        // Reset back to idle after 5 seconds
        setTimeout(() => setPublishState("idle"), 5000);
      } else {
        const body = await res.text();
        throw new Error(`GitHub API ${res.status}: ${body}`);
      }
    } catch (e) {
      setPublishError(String(e));
      setPublishState("error");
    }
  }

  if (!token) {
    return <LoginGate onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-teal-200 bg-teal-900 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl font-semibold text-white">
              AT Legends — Admin
            </h1>
            <p className="text-xs text-teal-300">CMS Content Manager</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Publish button */}
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishState === "loading" || publishState === "success"}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  publishState === "success"
                    ? "bg-green-500 text-white cursor-default"
                    : publishState === "loading"
                      ? "bg-gold-500/80 text-white cursor-wait opacity-80"
                      : publishState === "error"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gold-500 text-white hover:bg-gold-600"
                }`}
              >
                {publishState === "loading" && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {publishState === "success" && <span>✓</span>}
                {publishState === "error" && <span>✕</span>}
                {publishState === "idle" && <span>🚀</span>}

                {publishState === "loading" && "Publishing…"}
                {publishState === "success" && "Published! Building…"}
                {publishState === "error" && "Retry Publish"}
                {publishState === "idle" && "Publish to Website"}
              </button>

              {publishState === "success" && (
                <p className="text-xs text-green-300">
                  Site rebuild started (~2 min to go live)
                </p>
              )}
              {publishState === "error" && publishError && (
                <p className="max-w-xs text-right text-xs text-red-300">
                  {publishError}
                </p>
              )}
            </div>

            {/* Sign out */}
            <button
              type="button"
              onClick={() => setToken(null)}
              className="rounded-lg border border-teal-700 px-3 py-1.5 text-xs font-medium text-teal-200 hover:bg-teal-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* How it works hint — shown once */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
        Make your changes below, then click <strong>Publish to Website</strong> when ready. The site rebuilds in ~2 minutes.
      </div>

      {/* Tab navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-teal-700 text-teal-700"
                    : "border-transparent text-gray-500 hover:text-teal-700"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {activeTab === "services" && <ServicesTab token={token} />}
        {activeTab === "gallery" && <GalleryTab token={token} />}
        {activeTab === "testimonials" && <TestimonialsTab token={token} />}
      </main>
    </div>
  );
}
