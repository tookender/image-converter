import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Free to use in-browser image converter",
  openGraph: {
    title: "Image Converter",
    description: "Free to use in-browser image converter",
  },
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/dark_favicon.ico",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/light_favicon.ico",
      media: "(prefers-color-scheme: light)",
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="darkreader-lock" />
        <meta
          name="keywords"
          content="image converter, free image convert, in browser image converter, jpg to png, png to jpg, jpeg to png, png to jpeg, png to webp, webp to png, jpeg to webp, jpg to web"
        />
      </head>

      <body>
        <div className={`${inter.className} antialiased flex flex-col justify-between min-h-screen mx-auto w-full max-w-[950px]`}>
          {children}

          <Footer />
        </div>
      </body>
    </html>
  );
}
