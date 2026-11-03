import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import NavbarPage from "@/components/header/Navbar";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
 import { ToastContainer } from 'react-toastify';

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Kindora | Small Actions. Greater Impact.",
    template: "%s | Kindora",
  },
  description:
    "Discover local initiatives, connect with passionate volunteers, and create meaningful change in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunitoSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <header>
              <NavbarPage />
            </header>
            <ToastContainer/>
            <main>{children}</main>
            <footer></footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
