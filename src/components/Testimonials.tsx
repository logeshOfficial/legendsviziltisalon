"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = testimonials.length;

  function next() {
    setCurrent((c) => (c + 1) % total);
  }

  function prev() {
    setCurrent((c) => (c - 1 + total) % total);
  }

  useEffect(() => {
    if (paused || total <= 1) return;
    intervalRef.current = setInterval(next, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, total]); // eslint-disable-line react-hooks/exhaustive-deps

  if (total === 0) return null;

  // Show up to 3 visible cards centered on current
  const visibleIndices = total === 1
    ? [0]
    : total === 2
      ? [0, 1]
      : [-1, 0, 1].map((offset) => (current + offset + total) % total);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards */}
      <div className="flex items-stretch justify-center gap-4">
        {visibleIndices.map((idx, position) => {
          const item = testimonials[idx];
          const isCenter = total <= 2 ? position === 0 : position === 1;
          return (
            <blockquote
              key={`${idx}-${position}`}
              className={`flex flex-col rounded-xl border p-6 shadow-sm transition-all duration-500 ${
                isCenter
                  ? "w-full max-w-md scale-100 border-teal-200 bg-white opacity-100 sm:max-w-lg"
                  : "hidden w-full max-w-xs scale-95 border-teal-800 bg-teal-900/60 opacity-60 sm:flex sm:max-w-sm"
              }`}
            >
              <div className={`mb-3 flex gap-1 ${isCenter ? "text-gold-500" : "text-gold-400/60"}`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} aria-hidden="true" className="text-lg">
                    {i < item.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className={`flex-1 text-sm leading-relaxed italic ${isCenter ? "text-slate-600" : "text-teal-200/80"}`}>
                &ldquo;{item.text}&rdquo;
              </p>
              <footer className={`mt-4 text-sm font-medium ${isCenter ? "text-teal-800" : "text-teal-300/80"}`}>
                — {item.name}
              </footer>
            </blockquote>
          );
        })}
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-700 text-teal-300 hover:bg-teal-800 transition-colors"
          >
            ‹
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-gold-400"
                    : "w-2 bg-teal-700 hover:bg-teal-500"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-700 text-teal-300 hover:bg-teal-800 transition-colors"
          >
            ›
          </button>
        </div>
      )}

      {/* Auto-scroll progress bar */}
      {total > 1 && !paused && (
        <div className="mx-auto mt-4 h-0.5 max-w-xs overflow-hidden rounded-full bg-teal-800">
          <div
            key={current}
            className="h-full bg-gold-400 origin-left"
            style={{ animation: "testimonial-progress 4s linear forwards" }}
          />
        </div>
      )}
    </div>
  );
}
