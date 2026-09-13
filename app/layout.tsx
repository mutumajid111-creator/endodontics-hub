import type { Metadata } from "next";
import "./globals.css";
import "./brand-theme.css";
import "./member-dashboard.css";
import "./logo-fixes.css";
import "./experiences.css";

export const metadata: Metadata = {
  title: "Endodontics Hub | Dr. Muthanna Majid",
  description:
    "Clinical endodontics, complex root canal treatment, retreatment, separated instrument management, education and research.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
