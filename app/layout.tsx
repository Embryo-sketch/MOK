import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOK Limited — Sustainable business, built to last",
  description: "We turn sound environmental ideas into well-run, investable businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
