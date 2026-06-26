"use client";

import { useEffect, useState } from "react";
import { generateId, sanityMutate, sanityQuery } from "../sanityAdmin";
import type { Testimonial } from "@/types";

interface TestimonialsTabProps {
  token: string;
}

interface SanityTestimonial extends Testimonial {
  _id: string;
  order?: number;
}

const QUERY = `*[_type == "testimonial"] | order(order asc, _createdAt asc) {
  _id, name, text, rating, order
}`;

const emptyTestimonial = { name: "", text: "", rating: 5, order: 0 };

export default function TestimonialsTab({ token }: TestimonialsTabProps) {
  const [testimonials, setTestimonials] = useState<SanityTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ ...emptyTestimonial });
  const [addError, setAddError] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SanityTestimonial>>({});
  const [editSaving, setEditSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await sanityQuery<SanityTestimonial[]>(QUERY, token);
      setTestimonials(data ?? []);
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function addTestimonial() {
    setAddError("");
    if (!newItem.name.trim()) { setAddError("Client name is required."); return; }
    if (!newItem.text.trim()) { setAddError("Review text is required."); return; }
    if (newItem.rating < 1 || newItem.rating > 5) { setAddError("Rating must be 1–5."); return; }

    setAddSaving(true);
    try {
      const id = generateId();
      await sanityMutate(
        [
          {
            createOrReplace: {
              _id: id,
              _type: "testimonial",
              name: newItem.name.trim(),
              text: newItem.text.trim(),
              rating: Number(newItem.rating),
              order: Number(newItem.order) || 0,
            },
          },
        ],
        token,
      );
      setNewItem({ ...emptyTestimonial });
      await load();
    } catch (e) {
      setAddError(String(e));
    }
    setAddSaving(false);
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      await sanityMutate([{ delete: { id } }], token);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      setError(String(e));
    }
    setDeleting(null);
  }

  function startEdit(t: SanityTestimonial) {
    setEditing(t._id);
    setEditData({ name: t.name, text: t.text, rating: t.rating, order: t.order ?? 0 });
  }

  async function saveEdit(id: string) {
    setEditSaving(true);
    try {
      await sanityMutate(
        [
          {
            patch: {
              id,
              set: {
                name: editData.name?.trim(),
                text: editData.text?.trim(),
                rating: Number(editData.rating),
                order: Number(editData.order) || 0,
              },
            },
          },
        ],
        token,
      );
      setEditing(null);
      await load();
    } catch (e) {
      setError(String(e));
    }
    setEditSaving(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-teal-900">Testimonials</h2>
        <p className="mt-1 text-sm text-gray-500">Add, edit, or remove client reviews shown on the home page.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Add testimonial form */}
      <div className="mb-8 rounded-xl border border-teal-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-teal-900">Add Testimonial</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Client Name *</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="e.g. Priya S."
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600">Rating</label>
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNewItem((p) => ({ ...p, rating: n }))}
                    className={`text-xl transition-transform hover:scale-110 ${n <= newItem.rating ? "text-yellow-500" : "text-gray-200"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Order</label>
              <input
                type="number"
                min="0"
                value={newItem.order}
                onChange={(e) => setNewItem((p) => ({ ...p, order: Number(e.target.value) }))}
                className="w-16 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Review Text *</label>
            <textarea
              rows={3}
              value={newItem.text}
              onChange={(e) => setNewItem((p) => ({ ...p, text: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="What did this client say about their experience?"
            />
          </div>
        </div>

        {addError && <p className="mt-2 text-xs text-red-600">{addError}</p>}

        <button
          type="button"
          onClick={addTestimonial}
          disabled={addSaving}
          className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
        >
          {addSaving ? "Saving…" : "Add Testimonial"}
        </button>
      </div>

      {/* List */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">
          Existing Reviews
          <span className="ml-2 text-sm font-normal text-gray-400">({testimonials.length})</span>
        </h3>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">Loading testimonials…</div>
      ) : testimonials.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          No testimonials yet. Add your first review above.
        </p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) =>
            editing === t._id ? (
              <div key={t._id} className="rounded-xl border border-teal-300 bg-white p-5 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Name</label>
                    <input
                      type="text"
                      value={editData.name ?? ""}
                      onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setEditData((p) => ({ ...p, rating: n }))}
                            className={`text-xl ${(editData.rating ?? 0) >= n ? "text-yellow-500" : "text-gray-200"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Order</label>
                      <input
                        type="number"
                        min="0"
                        value={editData.order ?? 0}
                        onChange={(e) => setEditData((p) => ({ ...p, order: Number(e.target.value) }))}
                        className="w-16 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-600">Text</label>
                    <textarea
                      rows={3}
                      value={editData.text ?? ""}
                      onChange={(e) => setEditData((p) => ({ ...p, text: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(t._id)}
                    disabled={editSaving}
                    className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
                  >
                    {editSaving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={t._id}
                className={`flex items-start gap-4 rounded-xl border bg-white px-5 py-4 transition-opacity ${deleting === t._id ? "opacity-40" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{t.name}</span>
                    <span className="text-sm text-yellow-500">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </span>
                    {t.order !== undefined && t.order > 0 && (
                      <span className="text-xs text-gray-400">#{t.order}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-teal-700 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTestimonial(t._id)}
                    disabled={deleting !== null}
                    className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
