import Image from "next/image";
import type { GalleryImage, GalleryCategory } from "@/types";

interface GalleryGridProps {
  images: GalleryImage[];
  filter?: GalleryCategory;
  columns?: 2 | 3 | 4;
}

export default function GalleryGrid({
  images,
  filter,
  columns = 3,
}: GalleryGridProps) {
  const filtered =
    filter && filter !== "all"
      ? images.filter((img) => img.category === filter)
      : images;

  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-3";

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-slate-500">No images in this category yet.</p>
    );
  }

  return (
    <div className={`grid ${colClass} gap-3 sm:gap-4`}>
      {filtered.map((image) => (
        <figure
          key={image._id ?? image.url}
          className="group relative aspect-square overflow-hidden rounded-xl bg-teal-50"
        >
          <Image
            src={image.url}
            alt={image.caption ?? "Salon gallery"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          {image.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-teal-950/80 to-transparent px-3 py-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:text-sm">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
