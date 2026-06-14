import type { Metadata } from "next";
import { Baloo_2, Noto_Sans_Myanmar, Nunito } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Myanmar (Burmese) script support. Added to the body/display font stacks in
// globals.css so Burmese codepoints render with this font while Latin text
// keeps using Baloo/Nunito — no per-element font switching needed.
const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "600", "700"],
  variable: "--font-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sproutful",
    template: "%s · Sproutful",
  },
  description:
    "Discover the spark within — a Multiple Intelligences self-assessment for students.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${nunito.variable} ${notoMyanmar.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-body font-body">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
