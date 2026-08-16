import type { Metadata } from "next";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
    title: "Mustacho",
    description: "High school student from Istanbul. I build Discord bots and websites.",
};

// Runs synchronously before first paint — eliminates FOUC
const themeScript = `
(function() {
    try {
        var mode = localStorage.getItem('mustacho-theme-mode') || 'system';
        var theme = mode;
        if (mode === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);

        var colorTheme = localStorage.getItem('mustacho-color-theme');
        if (!colorTheme) {
            colorTheme = (theme === 'dark') ? 'default' : 'cream';
        }
        document.documentElement.setAttribute('data-color-theme', colorTheme);

        // Suppress CSS transitions during initial paint so the script-set
        // theme doesn't fade in — only user-triggered toggles should animate.
        var style = document.createElement('style');
        style.id = '__theme-no-transition';
        style.textContent = '*, *::before, *::after { transition: none !important; }';
        document.head.appendChild(style);
        window.addEventListener('load', function() {
            var el = document.getElementById('__theme-no-transition');
            if (el) el.remove();
        });
    } catch(e) {}
})();
`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
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