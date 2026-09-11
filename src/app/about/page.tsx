import type { Metadata } from "next";
import AboutClient from "./AboutClient";

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
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
