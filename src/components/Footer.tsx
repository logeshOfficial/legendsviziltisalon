import Link from "next/link";
import type { SiteSettings } from "@/types";
import { phoneHref, whatsappUrl } from "@/lib/utils";
import SalonLogo from "./SalonLogo";

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="mt-auto bg-teal-950 text-teal-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <SalonLogo
            salonName={settings.salonName}
            logoUrl={settings.logoUrl}
            variant="footer"
          />
          <p className="mt-4 text-sm leading-relaxed text-teal-200/90">
            {settings.tagline}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-gold-400 uppercase">
            Contact
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-teal-100">
            <li>
              <a href={phoneHref(settings.phone)} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp: Book Now
              </a>
            </li>
            <li className="leading-relaxed">{settings.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-gold-400 uppercase">
            Hours &amp; Links
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-teal-100">
            {settings.hours}
          </p>
          <nav className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/services" className="hover:text-white">
              Services
            </Link>
            <Link href="/gallery" className="hover:text-white">
              Gallery
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-teal-900 py-4 text-center text-xs text-teal-300/70">
        © {new Date().getFullYear()} {settings.salonName}. All rights reserved.
      </div>
    </footer>
  );
}
