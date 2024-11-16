import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#059669",
}

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Free to use in-browser image converter",
  openGraph: {
    title: "Image Converter",
    description: "Free to use in-browser image converter",
  },
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

      <body
        className={`${inter.className} antialiased flex flex-col justify-between min-h-screen mx-auto w-full max-w-[950px]`}
      >
        {children}

        <footer className="mt-12 mb-12 border-t-muted border-t-2 text-muted-foreground flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="ml-4 mt-4">
            <p>Free forever in-browser image converter</p>
            <h1>Made by <a className="font-bold text-sky-500" title="Ender Personal Portfolio" href="https://korino.dev" target="_blank">tookender</a></h1>
          </div>

          <div className="mr-4 mt-4 ml-4 md:ml-0">
            <p>Missing a feature? Request it <a className="font-bold text-sky-500" title="GitHub Issues Page" href="https://gitub.com/tookender/image-converter/issues" target="_blank">here</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
