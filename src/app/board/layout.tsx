import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tailwind-utils.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Solustream Board — Internal Dashboard",
  description: "Internal dashboard for form responses, invoicing, and MoU creation.",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${inter.className}`} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
