"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  links,
  pathname,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav className="absolute top-0 right-0 flex h-full w-72 flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-teal-100 px-5 py-4">
          <span className="font-serif text-lg font-semibold text-teal-900">Menu</span>
          <button
            type="button"
            className="rounded-md p-2 text-slate-600"
            aria-label="Close menu"
            onClick={onClose}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-700 hover:bg-teal-50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
