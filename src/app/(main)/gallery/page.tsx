import type { Metadata } from "next";
import GalleryFilter from "@/components/GalleryFilter";
import { getGalleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse hair styling, transformations, and bridal work from AT Legends — Trichy & Bangalore.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
          Portfolio
        </p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-teal-900">
          Photo Gallery
        </h1>
        <p className="mt-4 text-slate-600">
          A glimpse of our salon space, hair transformations, and bridal looks.
        </p>
      </div>

      <GalleryFilter images={images} />
    </div>
  );
}
