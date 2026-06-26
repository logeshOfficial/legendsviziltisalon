/**
 * One-time script to seed your Sanity project with the placeholder data.
 * Run: node scripts/seed-sanity.mjs
 * Requires .env.local to have NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_WRITE_TOKEN
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
function loadEnv() {
  try {
    const env = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
    for (const line of env.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      process.env[key] = val;
    }
  } catch {
    console.error("❌ Could not read .env.local — make sure it exists.");
    process.exit(1);
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Placeholder data ────────────────────────────────────────────────────────

const services = [
  { _id: "service-1",  name: "Hair Spa Treatment",          category: "spa-facial", price: 700,  duration: "60 min", description: "Luxury hair spa for silky, healthy hair",                    featured: true,  order: 1  },
  { _id: "service-2",  name: "Men's Haircut & Fade",         category: "mens",       price: 350,  duration: "30 min", description: "Precision fades and classic cuts",                           featured: true,  order: 2  },
  { _id: "service-3",  name: "Bridal & Groom Package",       category: "bridal",     price: 8500, duration: "3 hrs",  description: "Complete wedding-day look for bride and groom",              featured: true,  order: 3  },
  { _id: "service-4",  name: "Women's Haircut & Styling",    category: "womens",     price: 500,  duration: "45 min", description: "Layer cuts, blow-dry, and professional styling",             featured: true,  order: 4  },
  { _id: "service-5",  name: "Hair Transformation",          category: "womens",     price: 1500, duration: "90 min", description: "Curly to sleek, colour, and complete restyling",             featured: true,  order: 5  },
  { _id: "service-6",  name: "Beard Trim & Grooming",        category: "mens",       price: 200,  duration: "20 min", description: "Clean lines and professional beard shaping",                 featured: true,  order: 6  },
  { _id: "service-7",  name: "Facial & Skin Care",           category: "spa-facial", price: 800,  duration: "45 min", description: "Deep cleansing and glow treatments",                         featured: false, order: 7  },
  { _id: "service-8",  name: "Hair Colour",                  category: "womens",     price: 1200, duration: "90 min", description: "Global colour and highlights",                               featured: false, order: 8  },
  { _id: "service-9",  name: "Kids Haircut",                 category: "mens",       price: 200,  duration: "20 min", description: "Gentle cuts for children",                                   featured: false, order: 9  },
  { _id: "service-10", name: "Head Massage",                 category: "spa-facial", price: 400,  duration: "30 min", description: "Relaxing scalp massage with herbal oils",                    featured: false, order: 10 },
  { _id: "service-11", name: "Engagement Makeup",            category: "bridal",     price: 4500, duration: "2 hrs",  description: "Elegant look for engagement and reception",                  featured: false, order: 11 },
  { _id: "service-12", name: "Keratin Treatment",            category: "womens",     price: 3500, duration: "2 hrs",  description: "Smooth, frizz-free hair for weeks",                          featured: false, order: 12 },
];

const testimonials = [
  { _id: "testimonial-1", name: "Priya S.",  text: "Amazing hair spa and styling at AT Legends Trichy. My hair has never looked better — highly recommend!", rating: 5, order: 1 },
  { _id: "testimonial-2", name: "Rahul K.",  text: "Best fade in town. Professional team, clean salon, and great value. My go-to place in Trichy.",           rating: 5, order: 2 },
  { _id: "testimonial-3", name: "Divya M.",  text: "Got our bridal and groom packages here — the team made our wedding day look perfect. Thank you AT Legends!", rating: 5, order: 3 },
];

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  salonName: "AT Legends",
  tagline: "Legend's Vizilti Unisex Salon — hair, beauty & grooming experts. Where style meets perfection!",
  phone: "+91 86100 63509",
  whatsapp: "918610063509",
  address: "At Legend's Premium Unisex Salon, Trichy, Tamil Nadu",
  hours: "Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM",
};

// ── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🌱 Seeding Sanity project "${projectId}" / dataset "${dataset}"\n`);

  // Site settings (singleton)
  console.log("📋 Creating site settings…");
  await client.createOrReplace(siteSettings);
  console.log("   ✅ Done");

  // Services
  console.log(`\n✂️  Creating ${services.length} services…`);
  for (const s of services) {
    await client.createOrReplace({ ...s, _type: "service" });
    process.stdout.write(`   ✅ ${s.name}\n`);
  }

  // Testimonials
  console.log(`\n⭐ Creating ${testimonials.length} testimonials…`);
  for (const t of testimonials) {
    await client.createOrReplace({ ...t, _type: "testimonial" });
    process.stdout.write(`   ✅ ${t.name}\n`);
  }

  console.log("\n✨ Seed complete!");
  console.log("   Note: Gallery photos were skipped — upload them via the /admin panel");
  console.log("   (Images need to be uploaded as binary assets, not seeded from URLs)\n");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
