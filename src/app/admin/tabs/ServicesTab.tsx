"use client";

import { useEffect, useState } from "react";
import { sanityMutate, sanityQuery } from "../sanityAdmin";
import type { Service, ServiceCategory } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface ServicesTabProps {
  token: string;
}

const CATEGORIES: ServiceCategory[] = ["womens", "mens", "bridal", "spa-facial"];

interface NewServiceForm {
  name: string;
  category: ServiceCategory;
  price: number;
  duration: string;
  description: string;
  featured: boolean;
  order: number;
}

const emptyService: NewServiceForm = {
  name: "",
  category: "womens",
  price: 0,
  duration: "",
  description: "",
  featured: false,
  order: 0,
};

const QUERY = `*[_type == "service"] | order(order asc, name asc) {
  _id, name, category, price, duration, description, featured, order
}`;

export default function ServicesTab({ token }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState<NewServiceForm>({ ...emptyService });
  const [addError, setAddError] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await sanityQuery<Service[]>(QUERY, token);
      setServices(data ?? []);
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function updatePrice(service: Service, newPrice: number) {
    if (!service._id) return;
    setSaving(service._id);
    setError("");
    try {
      await sanityMutate(
        [{ patch: { id: service._id, set: { price: newPrice } } }],
        token,
      );
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, price: newPrice } : s)),
      );
    } catch (e) {
      setError(String(e));
    }
    setSaving(null);
  }

  async function toggleFeatured(service: Service) {
    if (!service._id) return;
    const next = !service.featured;
    setSaving(service._id);
    try {
      await sanityMutate(
        [{ patch: { id: service._id, set: { featured: next } } }],
        token,
      );
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, featured: next } : s)),
      );
    } catch (e) {
      setError(String(e));
    }
    setSaving(null);
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setSaving(id);
    try {
      await sanityMutate([{ delete: { id } }], token);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      setError(String(e));
    }
    setSaving(null);
  }

  async function addService() {
    setAddError("");
    if (!newService.name.trim()) {
      setAddError("Service name is required.");
      return;
    }
    if (newService.price < 0) {
      setAddError("Price must be 0 or more.");
      return;
    }
    setAddSaving(true);
    try {
      const doc = {
        _type: "service",
        name: newService.name.trim(),
        category: newService.category,
        price: Number(newService.price),
        duration: newService.duration.trim() || undefined,
        description: newService.description.trim() || undefined,
        featured: newService.featured,
        order: Number(newService.order) || 0,
      };
      await sanityMutate([{ create: doc }], token);
      setNewService({ ...emptyService });
      setShowAdd(false);
      await load();
    } catch (e) {
      setAddError(String(e));
    }
    setAddSaving(false);
  }

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: services.filter((s) => s.category === cat),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-teal-900">Services &amp; Prices</h2>
          <p className="mt-1 text-sm text-gray-500">Edit prices, toggle featured status, or add new services.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-teal-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
          >
            + Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add service form */}
      {showAdd && (
        <div className="mb-6 rounded-xl border border-teal-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-teal-900">New Service</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="e.g. Deep Conditioning Treatment"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category *</label>
              <select
                value={newService.category}
                onChange={(e) => setNewService((p) => ({ ...p, category: e.target.value as ServiceCategory }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={newService.price}
                onChange={(e) => setNewService((p) => ({ ...p, price: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Duration</label>
              <input
                type="text"
                value={newService.duration}
                onChange={(e) => setNewService((p) => ({ ...p, duration: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="e.g. 45 min"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea
                rows={2}
                value={newService.description}
                onChange={(e) => setNewService((p) => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                placeholder="Short service description…"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-600">Display Order</label>
              <input
                type="number"
                min="0"
                value={newService.order}
                onChange={(e) => setNewService((p) => ({ ...p, order: Number(e.target.value) }))}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="new-featured"
                type="checkbox"
                checked={newService.featured}
                onChange={(e) => setNewService((p) => ({ ...p, featured: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-teal-700 focus:ring-teal-600"
              />
              <label htmlFor="new-featured" className="text-xs font-medium text-gray-600">
                Featured on home page
              </label>
            </div>
          </div>
          {addError && (
            <p className="mt-3 text-xs text-red-600">{addError}</p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={addService}
              disabled={addSaving}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
            >
              {addSaving ? "Saving…" : "Save Service"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddError(""); setNewService({ ...emptyService }); }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">Loading services…</div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) =>
            group.items.length === 0 ? null : (
              <section key={group.category}>
                <h3 className="mb-3 border-b border-teal-100 pb-2 font-serif text-lg font-semibold text-teal-800">
                  {group.label}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({group.items.length})
                  </span>
                </h3>
                <div className="space-y-2">
                  {group.items.map((service) => (
                    <ServiceRow
                      key={service._id}
                      service={service}
                      saving={saving === service._id}
                      onPriceChange={updatePrice}
                      onToggleFeatured={toggleFeatured}
                      onDelete={deleteService}
                    />
                  ))}
                </div>
              </section>
            ),
          )}
          {services.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400">
              No services found. Add your first service above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface ServiceRowProps {
  service: Service;
  saving: boolean;
  onPriceChange: (service: Service, price: number) => void;
  onToggleFeatured: (service: Service) => void;
  onDelete: (id: string) => void;
}

function ServiceRow({ service, saving, onPriceChange, onToggleFeatured, onDelete }: ServiceRowProps) {
  const [price, setPrice] = useState(service.price);
  const [dirty, setDirty] = useState(false);

  function handlePriceChange(val: string) {
    const n = Number(val);
    setPrice(n);
    setDirty(n !== service.price);
  }

  function handleSave() {
    onPriceChange(service, price);
    setDirty(false);
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-opacity ${saving ? "opacity-60" : ""}`}>
      {/* Featured badge / toggle */}
      <button
        type="button"
        title={service.featured ? "Remove from featured" : "Add to featured"}
        onClick={() => onToggleFeatured(service)}
        disabled={saving}
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
          service.featured
            ? "bg-gold-500/20 text-yellow-700 hover:bg-gold-500/30"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
      >
        {service.featured ? "★ Featured" : "☆ Feature"}
      </button>

      <span className="min-w-0 flex-1 font-medium text-gray-900">{service.name}</span>

      {service.duration && (
        <span className="shrink-0 text-xs text-gray-400">{service.duration}</span>
      )}

      {/* Price editor */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm text-gray-500">₹</span>
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => handlePriceChange(e.target.value)}
          disabled={saving}
          className={`w-24 rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 ${
            dirty ? "border-teal-400 bg-teal-50" : "border-gray-300"
          }`}
        />
        {dirty && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
          >
            Save
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => service._id && onDelete(service._id)}
        disabled={saving}
        title="Delete service"
        className="shrink-0 rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        🗑
      </button>
    </div>
  );
}
