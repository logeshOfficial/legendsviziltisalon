/** Example GROQ queries for AT Legends / Legends Vizilti Salon CMS */

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  salonName,
  tagline,
  phone,
  whatsapp,
  address,
  hours,
  "heroImage": heroImage.asset->url
}`;

export const allServicesQuery = `*[_type == "service"] | order(order asc, name asc) {
  _id,
  name,
  category,
  price,
  duration,
  description,
  featured,
  order
}`;

export const featuredServicesQuery = `*[_type == "service" && featured == true] | order(order asc) [0...6] {
  _id,
  name,
  category,
  price,
  duration,
  description,
  featured,
  order
}`;

export const servicesByCategoryQuery = `*[_type == "service" && category == $category] | order(order asc, name asc) {
  _id,
  name,
  category,
  price,
  duration,
  description,
  featured,
  order
}`;

export const allGalleryQuery = `*[_type == "galleryImage"] | order(order asc) {
  _id,
  caption,
  category,
  order,
  "url": image.asset->url
}`;

export const galleryByCategoryQuery = `*[_type == "galleryImage" && category == $category] | order(order asc) {
  _id,
  caption,
  category,
  order,
  "url": image.asset->url
}`;

export const allTestimonialsQuery = `*[_type == "testimonial"] | order(order asc, _createdAt asc) {
  _id,
  name,
  text,
  rating,
  order
}`;

