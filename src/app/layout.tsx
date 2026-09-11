import type { Metadata } from "next";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
    metadataBase: new URL("https://mustacho.dev"),
    title: {
        default: "Mustacho — Developer & Student",
        template: "%s | Mustacho",
    },
    description: "High school student and developer from Istanbul. Building Discord bots, AI agents, desktop applications, and web experiments.",
    keywords: [
        "Mustacho",
        "imustacho",
        "developer",
        "portfolio",
        "Discord bot",
        "AI agent",
        "Tauri",
        "React",
        "Next.js",
        "TypeScript",
        "Istanbul",
    ],
    authors: [{ name: "Mustacho", url: "https://mustacho.dev" }],
    creator: "Mustacho",
    icons: {
        icon: [
            { url: "/mustacho.png?v=4", type: "image/png" },
        ],
        shortcut: "/mustacho.png?v=4",
        apple: "/mustacho.png?v=4",
    },
    openGraph: {
        title: "Mustacho — Developer & Student",
        description: "High school student and developer from Istanbul. Building Discord bots, AI agents, and modern software.",
        url: "https://mustacho.dev",
        siteName: "Mustacho",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/mustacho.png",
                width: 800,
                height: 800,
                alt: "Mustacho",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mustacho — Developer & Student",
        description: "High school student and developer from Istanbul. Building Discord bots, AI agents, and modern software.",
        images: ["/mustacho.png"],
        creator: "@imustachoo",
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
    alternates: {
        canonical: "/",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mustacho",
    url: "https://mustacho.dev",
    image: "https://mustacho.dev/mustacho.png",
    jobTitle: "Developer",
    sameAs: [
        "https://github.com/imustacho",
        "https://discord.gg/eJkymXBAXU",
        "https://www.youtube.com/@imustachoo",
        "https://open.spotify.com/user/31ouiktnesnmb4l555pdsjevaqcm",
    ],
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
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