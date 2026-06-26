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

export default function AdminClient() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("services");

  if (!token) {
    return <LoginGate onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-teal-200 bg-teal-900 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-semibold text-white">
              AT Legends — Admin
            </h1>
            <p className="text-xs text-teal-300">CMS Content Manager</p>
          </div>
          <button
            type="button"
            onClick={() => setToken(null)}
            className="rounded-lg border border-teal-700 px-3 py-1.5 text-xs font-medium text-teal-200 hover:bg-teal-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

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
