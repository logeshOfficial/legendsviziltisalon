import type { Service } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
}

export default function ServiceCard({ service, compact }: ServiceCardProps) {
  return (
    <article className="rounded-xl border border-teal-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-teal-900">{service.name}</h3>
        <span className="shrink-0 font-semibold text-gold-600">
          {formatPrice(service.price)}
        </span>
      </div>
      {!compact && service.description && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {service.description}
        </p>
      )}
      {service.duration && (
        <p className="mt-2 text-xs text-slate-400">{service.duration}</p>
      )}
    </article>
  );
}
