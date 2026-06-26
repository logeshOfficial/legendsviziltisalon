import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin — AT Legends",
  description: "CMS admin panel for AT Legends salon",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
