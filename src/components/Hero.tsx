import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/types";
import { assetPath, whatsappUrl } from "@/lib/utils";

interface HeroProps {
  settings: SiteSettings;
}

const HAIRSTYLING_CUTOUT = "/hero/hairstyling-cutout.png";

export default function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-teal-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-teal-900/95 to-teal-800/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,168,83,0.1)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          {/* Left — brand & CTAs */}
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-3 text-sm font-medium tracking-widest text-gold-400 uppercase">
              {settings.locationLabel ?? "Trichy · Bangalore"}
            </p>
            <h1 className="font-serif text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              {settings.salonName}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-teal-100/90 sm:text-xl lg:mx-0 mx-auto">
              {settings.tagline}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a
                href={whatsappUrl(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-teal-950 transition-colors hover:bg-gold-400"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Book on WhatsApp
              </a>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* Right — 3D hairstyling cutout + offer tags */}
          <div className="flex w-full max-w-sm flex-col items-center lg:max-w-md lg:items-end">
            <div className="hero-3d-scene relative w-full">
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gold-500/10 blur-3xl"
                aria-hidden
              />

              {/* Offer tag — top-left */}
              <div className="absolute -left-2 top-6 z-20 max-w-[140px] rounded-xl border border-white/15 bg-teal-900/80 px-3 py-2 shadow-lg backdrop-blur-sm sm:top-10">
                <p className="text-[10px] font-semibold tracking-widest text-gold-400 uppercase">Limited Offer</p>
                <p className="mt-0.5 text-xs font-semibold text-white leading-tight">Hair Cut</p>
                <p className="mt-0.5 text-xs">
                  <span className="text-teal-300/50 line-through">₹300</span>
                  <span className="ml-1.5 font-bold text-gold-400">₹200</span>
                </p>
              </div>

              {/* Offer tag — top-right */}
              <div className="absolute -right-2 top-20 z-20 max-w-[148px] rounded-xl border border-white/15 bg-teal-900/80 px-3 py-2 shadow-lg backdrop-blur-sm sm:top-28">
                <p className="text-[10px] font-semibold tracking-widest text-gold-400 uppercase">Limited Offer</p>
                <p className="mt-0.5 text-xs font-semibold text-white leading-tight">Hair Coloring</p>
                <p className="mt-0.5 text-xs">
                  <span className="text-teal-300/50 line-through">₹200</span>
                  <span className="ml-1.5 font-bold text-gold-400">₹150</span>
                </p>
              </div>

              {/* Offer tag — bottom-left */}
              <div className="absolute -left-2 bottom-24 z-20 max-w-[148px] rounded-xl border border-white/15 bg-teal-900/80 px-3 py-2 shadow-lg backdrop-blur-sm sm:bottom-28">
                <p className="text-[10px] font-semibold tracking-widest text-gold-400 uppercase">Limited Offer</p>
                <p className="mt-0.5 text-xs font-semibold text-white leading-tight">Head Massage</p>
                <p className="mt-0.5 text-xs">
                  <span className="text-teal-300/50 line-through">₹200</span>
                  <span className="ml-1.5 font-bold text-gold-400">₹180</span>
                </p>
              </div>

              {/* Offer tag — bottom-right (existing Hair Spa) */}
              <div className="absolute -right-2 bottom-8 z-20 max-w-[140px] rounded-xl border border-white/15 bg-teal-900/80 px-3 py-2 shadow-lg backdrop-blur-sm">
                <p className="text-[10px] font-semibold tracking-widest text-gold-400 uppercase">Limited Offer</p>
                <p className="mt-0.5 text-xs font-semibold text-white leading-tight">Hair Spa</p>
                <p className="mt-0.5 text-xs">
                  <span className="text-teal-300/50 line-through">₹1,200</span>
                  <span className="ml-1.5 font-bold text-gold-400">₹700</span>
                </p>
              </div>

              <div className="hero-3d-float mx-auto w-fit lg:mr-4">
                <div className="hero-3d-card">
                  <Image
                    src={assetPath(HAIRSTYLING_CUTOUT)}
                    alt="Professional hairstyling at AT Legends salon"
                    width={480}
                    height={772}
                    className="hero-3d-image"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
