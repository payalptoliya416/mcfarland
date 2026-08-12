import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ToastProvider from "@/components/common/ToastProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
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
  title: `Eastline Equipment Sales & Auctions`,
  description: "",
  icons: {
    icon: "/favicon-new.png",
    shortcut: "/favicon-new.png",
    apple: "/favicon-new.png",
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
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
          {/* ✅ LiveChat Script */}
        <Script id="livechat-script" strategy="afterInteractive">
          {`
            window.__lc = window.__lc || {};
            window.__lc.license = 19682522;
            window.__lc.integration_name = "manual_onboarding";
            window.__lc.product_name = "livechat";
            (function(n,t,c){
              function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}
              var e={
                _q:[],_h:null,_v:"2.0",
                on:function(){i(["on",c.call(arguments)])},
                once:function(){i(["once",c.call(arguments)])},
                off:function(){i(["off",c.call(arguments)])},
                get:function(){
                  if(!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
                  return i(["get",c.call(arguments)])
                },
                call:function(){i(["call",c.call(arguments)])},
                init:function(){
                  var n=t.createElement("script");
                  n.async=true;
                  n.type="text/javascript";
                  n.src="https://cdn.livechatinc.com/tracking.js";
                  t.head.appendChild(n)
                }
              };
              !n.__lc.asyncInit && e.init();
              n.LiveChatWidget = n.LiveChatWidget || e;
            })(window,document,[].slice);
          `}
        </Script>
      </head>

      <body
        className={`${mont.variable} ${sfPro.variable} antialiased`}
        suppressHydrationWarning
      >

        <noscript>
          <a
            href="https://www.livechat.com/chat-with/19682522/"
            rel="nofollow"
          >
            Chat with us
          </a>
        </noscript>

        <SettingsProvider>
          {children}
          <ToastProvider />
        </SettingsProvider>
      </body>
    </html>
  );
}
