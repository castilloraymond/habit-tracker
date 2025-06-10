import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Habit Tracker",
    template: "%s | Habit Tracker",
  },
  description: "Track your daily habits and build lasting routines with our simple and effective habit tracker.",
  keywords: ["habits", "tracking", "productivity", "goals", "routine", "self-improvement"],
  authors: [{ name: "Habit Tracker Team" }],
  creator: "Habit Tracker",
  publisher: "Habit Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Habit Tracker",
    description: "Track your daily habits and build lasting routines",
    siteName: "Habit Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Habit Tracker",
    description: "Track your daily habits and build lasting routines",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Habit Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <div id="root" className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  );
}
