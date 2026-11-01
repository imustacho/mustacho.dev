import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

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
        images: [getSocialImage("/about", "About | Mustacho")],
    },
    twitter: getTwitterMetadata("/about", "About | Mustacho", "Get to know the student and developer behind Mustacho."),
};

export default function AboutPage() {
    return <AboutClient />;
}
