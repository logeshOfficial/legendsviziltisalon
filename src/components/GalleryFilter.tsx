"use client";

import { useState } from "react";
import GalleryGrid from "./GalleryGrid";
import type { GalleryCategory, GalleryImage } from "@/types";
import { GALLERY_CATEGORY_LABELS } from "@/types";

interface GalleryFilterProps {
  images: GalleryImage[];
}

const filters: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "All" },
  ...Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => ({
    value: value as GalleryCategory,
    label,
  })),
];

export default function GalleryFilter({ images }: GalleryFilterProps) {
  const [active, setActive] = useState<GalleryCategory>("all");

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === filter.value
                ? "bg-teal-700 text-white"
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <GalleryGrid images={images} filter={active} columns={3} />
    </div>
  );
}
