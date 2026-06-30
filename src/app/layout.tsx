import type { Metadata } from "next";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Mustacho",
  description: "Turning ideas into reality, one commit at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BackgroundWrapper>
          <Navbar />
          {children}
        </BackgroundWrapper>
      </body>
    </html>
  );
}