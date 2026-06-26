import type { GalleryImage, Service, SiteSettings, Testimonial } from "@/types";

export const placeholderSettings: SiteSettings = {
  salonName: "AT Legends",
  tagline:
    "Legend's Vizilti Unisex Salon — hair, beauty & grooming experts. Where style meets perfection!",
  phone: "+91 86100 63509",
  whatsapp: "918610063509",
  address:
    "At Legend's Premium Unisex Salon, Trichy, Tamil Nadu (10.8214859, 78.683574)",
  hours: "Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM",
  heroImage: "/gallery/post-01.jpg",
  logoUrl: "/logo.jpg",
  locationLabel: "Trichy · Bangalore",
};

export const placeholderServices: Service[] = [
  {
    _id: "1",
    name: "Hair Spa Treatment",
    category: "spa-facial",
    price: 700,
    duration: "60 min",
    description: "Luxury hair spa for silky, healthy hair",
    featured: true,
    order: 1,
  },
  {
    _id: "2",
    name: "Men's Haircut & Fade",
    category: "mens",
    price: 350,
    duration: "30 min",
    description: "Precision fades and classic cuts",
    featured: true,
    order: 2,
  },
  {
    _id: "3",
    name: "Bridal & Groom Package",
    category: "bridal",
    price: 8500,
    duration: "3 hrs",
    description: "Complete wedding-day look for bride and groom",
    featured: true,
    order: 3,
  },
  {
    _id: "4",
    name: "Women's Haircut & Styling",
    category: "womens",
    price: 500,
    duration: "45 min",
    description: "Layer cuts, blow-dry, and professional styling",
    featured: true,
    order: 4,
  },
  {
    _id: "5",
    name: "Hair Transformation",
    category: "womens",
    price: 1500,
    duration: "90 min",
    description: "Curly to sleek, colour, and complete restyling",
    featured: true,
    order: 5,
  },
  {
    _id: "6",
    name: "Beard Trim & Grooming",
    category: "mens",
    price: 200,
    duration: "20 min",
    description: "Clean lines and professional beard shaping",
    featured: true,
    order: 6,
  },
  {
    _id: "7",
    name: "Facial & Skin Care",
    category: "spa-facial",
    price: 800,
    duration: "45 min",
    description: "Deep cleansing and glow treatments",
    order: 7,
  },
  {
    _id: "8",
    name: "Hair Colour",
    category: "womens",
    price: 1200,
    duration: "90 min",
    description: "Global colour and highlights",
    order: 8,
  },
  {
    _id: "9",
    name: "Kids Haircut",
    category: "mens",
    price: 200,
    duration: "20 min",
    description: "Gentle cuts for children",
    order: 9,
  },
  {
    _id: "10",
    name: "Head Massage",
    category: "spa-facial",
    price: 400,
    duration: "30 min",
    description: "Relaxing scalp massage with herbal oils",
    order: 10,
  },
  {
    _id: "11",
    name: "Engagement Makeup",
    category: "bridal",
    price: 4500,
    duration: "2 hrs",
    description: "Elegant look for engagement and reception",
    order: 11,
  },
  {
    _id: "12",
    name: "Keratin Treatment",
    category: "womens",
    price: 3500,
    duration: "2 hrs",
    description: "Smooth, frizz-free hair for weeks",
    order: 12,
  },
];

export const placeholderGallery: GalleryImage[] = [
  {
    _id: "g1",
    url: "/gallery/post-01.jpg",
    caption: "Hair spa — luxury treatment",
    category: "hair",
    order: 1,
  },
  {
    _id: "g2",
    url: "/gallery/post-02.jpg",
    caption: "Professional hair styling",
    category: "hair",
    order: 2,
  },
  {
    _id: "g3",
    url: "/gallery/post-03.jpg",
    caption: "Bridal & groom packages",
    category: "bridal",
    order: 3,
  },
  {
    _id: "g4",
    url: "/gallery/post-04.jpg",
    caption: "Hair therapy transformation",
    category: "hair",
    order: 4,
  },
  {
    _id: "g5",
    url: "/gallery/post-05.jpg",
    caption: "Hair transformation",
    category: "hair",
    order: 5,
  },
  {
    _id: "g6",
    url: "/gallery/post-06.jpg",
    caption: "Long layer haircut",
    category: "hair",
    order: 6,
  },
  {
    _id: "g7",
    url: "/gallery/post-07.jpg",
    caption: "Curly to sleek styling",
    category: "hair",
    order: 7,
  },
  {
    _id: "g8",
    url: "/gallery/post-08.jpg",
    caption: "Step-by-step hair styling",
    category: "hair",
    order: 8,
  },
  {
    _id: "g9",
    url: "/gallery/post-09.jpg",
    caption: "Fresh cut, fresh confidence",
    category: "hair",
    order: 9,
  },
  {
    _id: "g10",
    url: "/gallery/post-10.jpg",
    caption: "Trending cuts at Trichy",
    category: "hair",
    order: 10,
  },
  {
    _id: "g11",
    url: "/gallery/post-11.jpg",
    caption: "Precision fade",
    category: "hair",
    order: 11,
  },
  {
    _id: "g12",
    url: "/gallery/post-12.jpg",
    caption: "Expert cuts for a flawless look",
    category: "hair",
    order: 12,
  },
];

export const placeholderTestimonials: Testimonial[] = [
  {
    name: "Priya S.",
    text: "Amazing hair spa and styling at AT Legends Trichy. My hair has never looked better — highly recommend!",
    rating: 5,
  },
  {
    name: "Rahul K.",
    text: "Best fade in town. Professional team, clean salon, and great value. My go-to place in Trichy.",
    rating: 5,
  },
  {
    name: "Divya M.",
    text: "Got our bridal and groom packages here — the team made our wedding day look perfect. Thank you AT Legends!",
    rating: 5,
  },
];

export const whyChooseUs = [
  {
    title: "Expert Stylists",
    description:
      "Skilled in haircuts, fades, bridal looks, and complete transformations for men and women.",
  },
  {
    title: "Unisex Salon",
    description:
      "Hair, beauty, and grooming under one roof — Legend's Vizilti experience in Trichy and Bangalore.",
  },
  {
    title: "Premium Products",
    description:
      "Quality products and techniques for lasting results you can see and feel.",
  },
  {
    title: "Two Locations",
    description:
      "Convenient branches in Trichy (8610063509) and Bangalore (9080170542). Book on WhatsApp anytime.",
  },
];
