import type { Metadata } from "next";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
    title: "Mustacho",
    description: "High school student from Istanbul. I build Discord bots and websites.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <BackgroundWrapper>
                        <Navbar />
                        {children}
                    </BackgroundWrapper>
                </ThemeProvider>
            </body>
        </html>
    );
}