import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MapEmbed from "@/components/MapEmbed";
import ServiceCard from "@/components/ServiceCard";
import GalleryGrid from "@/components/GalleryGrid";
import Testimonials from "@/components/Testimonials";
import { whyChooseUs } from "@/data/placeholder";
import { getFeaturedServices, getGalleryImages, getSiteSettings, getTestimonials } from "@/lib/data";
import { phoneHref, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
  description:
    "AT Legends — hair, beauty & grooming at Legend's Vizilti Unisex Salon in Trichy and Bangalore. Book on WhatsApp.",
};

export default async function HomePage() {
  const [settings, services, gallery, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedServices(),
    getGalleryImages(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero settings={settings} />

      {/* Services Preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
              Our Services
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-teal-900">
              Popular Treatments
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View all services →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id ?? service.name} service={service} compact />
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-teal-50/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
                Gallery
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-teal-900">
                Our Work
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              See full gallery →
            </Link>
          </div>
          <GalleryGrid images={gallery.slice(0, 6)} columns={3} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
            Why Choose Us
          </p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-teal-900">
            Trichy &amp; Bangalore&apos;s Trusted Salon
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-teal-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <span className="text-lg">✦</span>
              </div>
              <h3 className="font-semibold text-teal-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-teal-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium tracking-widest text-gold-400 uppercase">
              Testimonials
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold">
              What Our Clients Say
            </h2>
          </div>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Location & Hours */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
              Visit Us
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-teal-900">
              Location &amp; Hours
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-teal-800">Address</dt>
                <dd className="mt-1 text-slate-600">{settings.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-teal-800">Phone</dt>
                <dd>
                  <a
                    href={phoneHref(settings.phone)}
                    className="text-teal-700 hover:underline"
                  >
                    {settings.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-teal-800">Hours</dt>
                <dd className="text-slate-600">{settings.hours}</dd>
              </div>
            </dl>
            <a
              href={whatsappUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Book on WhatsApp
            </a>
          </div>
          <MapEmbed />
        </div>
      </section>
    </>
  );
}
