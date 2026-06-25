import type { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item) => (
        <blockquote
          key={item.name}
          className="rounded-xl border border-teal-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-3 flex gap-1 text-gold-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} aria-hidden="true">
                {i < item.rating ? "★" : "☆"}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-slate-600 italic">
            &ldquo;{item.text}&rdquo;
          </p>
          <footer className="mt-4 text-sm font-medium text-teal-800">
            — {item.name}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
