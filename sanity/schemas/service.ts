import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Service Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Men's", value: "mens" },
          { title: "Women's", value: "womens" },
          { title: "Bridal", value: "bridal" },
          { title: "Spa & Facial", value: "spa-facial" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (INR)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g. "45 min" or "2 hrs"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featured",
      title: "Featured on Home Page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "category", price: "price" },
    prepare({ title, subtitle, price }) {
      return {
        title,
        subtitle: `${subtitle} — ₹${price}`,
      };
    },
  },
});
