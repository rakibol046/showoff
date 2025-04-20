import { Asul, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import Header from "@/components/header/header";
import { ModeToggle } from "@/components/common/mode-toggle";
import Footer from "@/components/footer/footer";
import HeaderTop from "@/components/header/header-top";
import HeaderMobile from "@/components/header/header-mobile";

const asul = Asul({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-asul",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Home | ShowOff",
  description: "A e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`font-[poppins] antialiase`}
    >
      <body>
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
