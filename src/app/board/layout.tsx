import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./tailwind-utils.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Solustream Board — Internal Dashboard",
  description: "Internal dashboard for form responses, invoicing, and MoU creation.",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${plusJakarta.variable} ${plusJakarta.className}`} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
