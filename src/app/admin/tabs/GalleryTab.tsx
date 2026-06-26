"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { generateId, sanityMutate, sanityQuery, uploadImageAsset } from "../sanityAdmin";
import type { GalleryCategory, GalleryImage } from "@/types";
import { GALLERY_CATEGORY_LABELS } from "@/types";

interface GalleryTabProps {
  token: string;
}

type UploadCategory = Exclude<GalleryCategory, "all">;

const CATEGORIES: UploadCategory[] = ["hair", "bridal", "interior"];

const QUERY = `*[_type == "galleryImage"] | order(order asc) {
  _id, caption, category, order,
  "url": image.asset->url,
  "assetId": image.asset._ref
}`;

interface GalleryImageWithAsset extends GalleryImage {
  assetId?: string;
}

export default function GalleryTab({ token }: GalleryTabProps) {
  const [images, setImages] = useState<GalleryImageWithAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<GalleryCategory>("all");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState<UploadCategory>("hair");
  const [uploadOrder, setUploadOrder] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await sanityQuery<GalleryImageWithAsset[]>(QUERY, token);
      setImages(data ?? []);
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadError("Please select an image.");
      return;
    }
    setUploadError("");
    setUploading(true);
    setUploadProgress("Uploading image…");

    try {
      const assetId = await uploadImageAsset(selectedFile, token);
      setUploadProgress("Creating gallery entry…");

      const newId = generateId();
      await sanityMutate(
        [
          {
            createOrReplace: {
              _id: newId,
              _type: "galleryImage",
              image: {
                _type: "image",
                asset: { _type: "reference", _ref: assetId },
              },
              caption: uploadCaption.trim() || undefined,
              category: uploadCategory,
              order: Number(uploadOrder) || 0,
            },
          },
        ],
        token,
      );

      setUploadProgress("Done!");
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadCaption("");
      setUploadOrder(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await load();
    } catch (e) {
      setUploadError(String(e));
    }

    setUploading(false);
    setUploadProgress("");
  }

  async function deleteImage(image: GalleryImageWithAsset) {
    if (!image._id) return;
    if (!confirm("Remove this photo from the gallery?")) return;
    setDeleting(image._id);
    try {
      await sanityMutate([{ delete: { id: image._id } }], token);
      setImages((prev) => prev.filter((i) => i._id !== image._id));
    } catch (e) {
      setError(String(e));
    }
    setDeleting(null);
  }

  const filtered =
    filter === "all"
      ? images
      : images.filter((i) => i.category === filter);

  const filterOptions: { value: GalleryCategory; label: string }[] = [
    { value: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ value: c as GalleryCategory, label: GALLERY_CATEGORY_LABELS[c] })),
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-teal-900">Gallery Photos</h2>
        <p className="mt-1 text-sm text-gray-500">Upload new photos or remove existing ones.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Upload card */}
      <div className="mb-8 rounded-xl border border-teal-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-teal-900">Upload Photo</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* File picker */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Image *</label>
            <div
              className="relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-3xl text-gray-300">📷</div>
                  <p className="mt-1 text-xs text-gray-400">Click to choose image</p>
                  <p className="text-xs text-gray-300">JPG, PNG, WEBP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as UploadCategory)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{GALLERY_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Caption (optional)</label>
              <input
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="e.g. Fresh bridal look"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Display Order</label>
              <input
                type="number"
                min="0"
                value={uploadOrder}
                onChange={(e) => setUploadOrder(Number(e.target.value))}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {uploadError && (
          <p className="mt-3 text-xs text-red-600">{uploadError}</p>
        )}
        {uploadProgress && (
          <p className="mt-3 text-xs text-teal-600">{uploadProgress}</p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading…" : "Upload Photo"}
          </button>
          {selectedFile && (
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter + grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">
          Existing Photos
          <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
        </h3>
        <div className="flex gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === opt.value
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">Loading gallery…</div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">No photos in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((image) => (
            <div
              key={image._id}
              className={`group relative aspect-square overflow-hidden rounded-xl bg-gray-100 transition-opacity ${deleting === image._id ? "opacity-40" : ""}`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt={image.caption ?? "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  unoptimized
                />
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-colors group-hover:bg-black/50">
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => deleteImage(image)}
                    disabled={deleting !== null}
                    title="Remove photo"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-block rounded-full bg-teal-700/80 px-2 py-0.5 text-xs text-white capitalize">
                    {image.category}
                  </span>
                  {image.caption && (
                    <p className="mt-1 text-xs text-white/90 line-clamp-2">{image.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
