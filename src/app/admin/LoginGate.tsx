"use client";

import { useState, type FormEvent } from "react";

interface LoginGateProps {
  onLogin: (token: string) => void;
}

export default function LoginGate({ onLogin }: LoginGateProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const token = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

    // Check credentials match env vars
    if (!expectedUsername || !expectedPassword) {
      setError("Admin credentials are not configured. Set NEXT_PUBLIC_ADMIN_USERNAME and NEXT_PUBLIC_ADMIN_PASSWORD.");
      setLoading(false);
      return;
    }

    if (username.trim() !== expectedUsername || password !== expectedPassword) {
      // Small delay to slow down brute force attempts
      await new Promise((r) => setTimeout(r, 600));
      setError("Incorrect username or password.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Sanity write token is not configured. Set NEXT_PUBLIC_SANITY_WRITE_TOKEN.");
      setLoading(false);
      return;
    }

    if (!projectId) {
      setError("Sanity project ID is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID.");
      setLoading(false);
      return;
    }

    // Verify the token actually works against Sanity
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

    try {
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type%3D%3D%22siteSettings%22][0]{salonName}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        throw new Error(`Sanity connection failed (${res.status})`);
      }
      onLogin(token);
    } catch {
      setError("Could not connect to Sanity. Check your project ID and write token in the environment variables.");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-950 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-800 text-2xl">
            ✂️
          </div>
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

          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="admin"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="••••••••"
            />
          </div>

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
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
