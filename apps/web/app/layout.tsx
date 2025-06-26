import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer";

const workSans = Work_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rolefit",
  description: "Save time and money with AI-powered candidate screening",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.className} min-h-screen flex flex-col`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
