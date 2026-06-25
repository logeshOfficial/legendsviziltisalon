import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/data";
import { CATEGORY_LABELS, type ServiceCategory } from "@/types";

export const metadata: Metadata = {
  title: "Services & Prices",
  description:
    "Haircuts, spa, bridal packages, fades, and grooming at AT Legends — Trichy & Bangalore.",
};

const categoryOrder: ServiceCategory[] = [
  "womens",
  "mens",
  "bridal",
  "spa-facial",
];

export default async function ServicesPage() {
  const services = await getServices();

  const grouped = categoryOrder.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: services.filter((s) => s.category === category),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
          Price List
        </p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-teal-900">
          Services &amp; Prices
        </h1>
        <p className="mt-4 text-slate-600">
          Professional beauty and grooming services for men and women. Bridal packages
          available with trial sessions.
        </p>
      </div>

      <div className="space-y-14">
        {grouped.map(
          (group) =>
            group.items.length > 0 && (
              <section key={group.category}>
                <h2 className="mb-6 border-b border-teal-200 pb-2 font-serif text-2xl font-semibold text-teal-800">
                  {group.label}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.items.map((service) => (
                    <ServiceCard
                      key={service._id ?? service.name}
                      service={service}
                    />
                  ))}
                </div>
              </section>
            ),
        )}
      </div>

      <p className="mt-12 rounded-lg border border-gold-200 bg-gold-50/50 px-5 py-4 text-sm text-slate-600">
        <strong className="text-teal-900">Note:</strong> Prices may vary depending on
        hair length, product choice, and package details — please call or WhatsApp us
        to confirm before your visit.
      </p>
    </div>
  );
}
