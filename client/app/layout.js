import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "@/components/footer";
import HeaderTop from "@/components/header-top";
import HeaderMobile from "@/components/header-mobile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home | ShowOff",
  description: "A e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiase`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <HeaderTop /> */}

          <Header />

          <HeaderMobile />

          <main> {children}</main>
          <Footer />
          <div className="actions z-50 fixed bottom-6 right-6">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
