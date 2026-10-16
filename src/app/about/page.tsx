import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { SITE_OG_IMAGE } from "@/lib/site-image";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Mustacho — high school student and developer from Istanbul, building bots, websites, and exploring electronics.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About | Mustacho",
        description: "Learn more about Mustacho — high school student and developer from Istanbul, building bots, websites, and exploring electronics.",
        url: "https://mustacho.dev/about",
        images: [SITE_OG_IMAGE],
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
