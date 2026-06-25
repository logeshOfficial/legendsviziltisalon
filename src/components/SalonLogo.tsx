import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/utils";

interface SalonLogoProps {
  salonName: string;
  logoUrl?: string;
  subtitle?: string;
  variant?: "header" | "footer";
}

export default function SalonLogo({
  salonName,
  logoUrl = "/logo.jpg",
  subtitle = "Hair · Beauty · Grooming",
  variant = "header",
}: SalonLogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link href="/" className="group flex items-center gap-3">
      <Image
        src={assetPath(logoUrl)}
        alt={`${salonName} logo`}
        width={isFooter ? 48 : 44}
        height={isFooter ? 48 : 44}
        className={`rounded-full object-cover ring-2 ${
          isFooter ? "ring-teal-700" : "ring-teal-100"
        }`}
      />
      <div>
        <span
          className={`font-serif font-semibold ${
            isFooter
              ? "text-xl text-white"
              : "text-xl text-teal-900 sm:text-2xl"
          }`}
        >
          {salonName}
        </span>
        <span
          className={`mt-0.5 block text-xs tracking-widest uppercase ${
            isFooter ? "text-gold-400" : "text-gold-600"
          }`}
        >
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
