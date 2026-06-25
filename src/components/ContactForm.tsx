"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setStatus("success");
          form.reset();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    } else {
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-teal-200 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          placeholder="Priya S."
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full rounded-lg border border-teal-200 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          placeholder="9876543210"
        />
      </div>
      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-medium text-slate-700">
          Service Interested In
        </label>
        <select
          id="service"
          name="service"
          className="w-full rounded-lg border border-teal-200 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        >
          <option value="">Select a service</option>
          <option value="haircut">Haircut &amp; Styling</option>
          <option value="facial">Facial / Spa</option>
          <option value="bridal">Bridal Makeup</option>
          <option value="threading">Threading</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-teal-200 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          placeholder="Preferred date/time, any special requests..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Enquiry"}
      </button>

      {status === "success" && (
        <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Thank you! We&apos;ll get back to you shortly. For faster booking, message us on WhatsApp.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please call us or message on WhatsApp directly.
        </p>
      )}

      {!formspreeId && status === "idle" && (
        <p className="text-xs text-slate-400">
          Demo mode: form shows success without sending. Set NEXT_PUBLIC_FORMSPREE_ID to enable real submissions.
        </p>
      )}
    </form>
  );
}
