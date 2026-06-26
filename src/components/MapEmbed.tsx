import { SALON_MAP } from "@/lib/maps";

interface MapEmbedProps {
  showDirections?: boolean;
  className?: string;
}

export default function MapEmbed({
  showDirections = true,
  className = "",
}: MapEmbedProps) {
  return (
    <div className={className}>
      <div className="relative aspect-video min-h-[280px] w-full overflow-hidden rounded-xl border border-teal-200 bg-teal-50">
        <iframe
          src={SALON_MAP.embedUrl}
          title={`${SALON_MAP.placeName} on Google Maps`}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {showDirections && (
        <a
          href={SALON_MAP.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          Get Directions →
        </a>
      )}
    </div>
  );
}
