import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ToastProvider from "@/components/common/ToastProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import MetadataUpdater from "@/components/common/MetadataUpdater";
import Script from "next/script";
// ---------------- MONT FONT ----------------
const mont = localFont({
  src: [
    { path: "../public/fonts/Mont/Mont-Light.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Mont/Mont-Regular.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Mont/Mont-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Mont/Mont-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-mont",
  display: "swap",
});

// ---------------- SF PRO FONT ----------------

const sfPro = localFont({
  src: [
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/SF-Pro-Text/SF-Pro-Text-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-sfpro",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_TITLE}`,
  description: "",
  icons: {
    icon: "/favicon-new.png",
  },

   robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
       <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KF54G2N6');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>

      <body
        className={`${mont.variable} ${sfPro.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KF54G2N6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <SettingsProvider>
          {children}
          <ToastProvider />
        </SettingsProvider>
      </body>
    </html>
  );
}
