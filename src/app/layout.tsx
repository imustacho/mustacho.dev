import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import { SITE_IMAGE_URL, SITE_OG_IMAGE } from "@/lib/site-image";

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
        icon: [{ url: "/mustache.svg", type: "image/svg+xml" }],
        shortcut: "/mustache.svg",
        apple: SITE_IMAGE_URL,
    },
    openGraph: {
        title: "Mustacho — Developer & Student",
        description: "High school student and developer from Istanbul. Building Discord bots, AI agents, and modern software.",
        url: "https://mustacho.dev",
        siteName: "Mustacho",
        locale: "en_US",
        type: "website",
        images: [SITE_OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mustacho — Developer & Student",
        description: "High school student and developer from Istanbul. Building Discord bots, AI agents, and modern software.",
        images: [SITE_IMAGE_URL],
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
    image: `https://mustacho.dev${SITE_IMAGE_URL}`,
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
        var mode = 'system';
        var colorTheme = null;
        try {
            mode = localStorage.getItem('mustacho-theme-mode') || 'system';
            colorTheme = localStorage.getItem('mustacho-color-theme');
        } catch(e) {}
        if (['light', 'dark', 'system'].indexOf(mode) === -1) mode = 'system';
        var theme = mode;
        if (mode === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;

        if (['default', 'cream', 'red', 'blue'].indexOf(colorTheme) === -1) {
            colorTheme = (theme === 'dark') ? 'default' : 'cream';
        }
        document.documentElement.setAttribute('data-color-theme', colorTheme);
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
                <link rel="preload" href="/fonts/dynapuff-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/fonts/fredoka-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
