import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import { getSiteSettings } from "@/lib/data";
import { phoneHref, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AT Legends in Trichy or Bangalore. Call, WhatsApp, or send an enquiry.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-medium tracking-widest text-gold-600 uppercase">
          Get in Touch
        </p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-teal-900">
          Contact Us
        </h1>
        <p className="mt-4 text-slate-600">
          Walk-ins welcome. For bridal bookings and packages, we recommend calling or
          messaging us in advance.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="rounded-xl border border-teal-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-teal-900">Salon Details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-slate-500">Address</dt>
                <dd className="mt-1 text-slate-700">{settings.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Phone</dt>
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
                <dt className="font-medium text-slate-500">WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappUrl(settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline"
                  >
                    Message us on WhatsApp
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Business Hours</dt>
                <dd className="text-slate-700">{settings.hours}</dd>
              </div>
            </dl>
          </div>

          <MapEmbed />
        </div>

        <div className="rounded-xl border border-teal-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-semibold text-teal-900">Send an Enquiry</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
