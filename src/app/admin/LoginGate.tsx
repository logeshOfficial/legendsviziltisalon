"use client";

import { useState, type FormEvent } from "react";

interface LoginGateProps {
  onLogin: (token: string) => void;
}

export default function LoginGate({ onLogin }: LoginGateProps) {
  const [password, setPassword] = useState("");
  const [token, setTokenField] = useState(
    process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN ?? "",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // If no admin password is set, skip password check and just validate token
    if (expectedPassword && password !== expectedPassword) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    if (!token.trim()) {
      setError("Please enter your Sanity write token.");
      setLoading(false);
      return;
    }

    // Verify the token works by hitting the Sanity users endpoint
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

    if (!projectId) {
      setError(
        "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Configure your .env file.",
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type=="siteSettings"][0]{salonName}`,
        { headers: { Authorization: `Bearer ${token.trim()}` } },
      );
      if (!res.ok) {
        throw new Error(`Token check failed: ${res.status}`);
      }
      onLogin(token.trim());
    } catch {
      setError(
        "Could not connect to Sanity. Check your project ID and token.",
      );
    }

    setLoading(false);
  }

  const hasEnvToken = Boolean(process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN);
  const hasEnvPassword = Boolean(process.env.NEXT_PUBLIC_ADMIN_PASSWORD);

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold text-white">
            AT Legends
          </h1>
          <p className="mt-1 text-sm text-teal-400">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-xl"
        >
          <h2 className="mb-6 font-semibold text-teal-900">Sign in</h2>

          {hasEnvPassword && (
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="Enter admin password"
              />
            </div>
          )}

          {!hasEnvToken && (
            <div className="mb-4">
              <label
                htmlFor="token"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                Sanity Write Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setTokenField(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="sk..."
              />
              <p className="mt-1 text-xs text-gray-400">
                Create at sanity.io/manage → API → Tokens (Editor role)
              </p>
            </div>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60 transition-colors"
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
