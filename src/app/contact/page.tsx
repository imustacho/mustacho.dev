import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getSocialImage, getTwitterMetadata } from "@/lib/social-image";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Mustacho via an interactive developer terminal, or connect via Discord, GitHub, and email.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact | Mustacho",
        description: "Get in touch with Mustacho via an interactive developer terminal, or connect via Discord, GitHub, and email.",
        url: "https://mustacho.dev/contact",
        images: [getSocialImage("/contact", "Contact | Mustacho")],
    },
    twitter: getTwitterMetadata("/contact", "Contact | Mustacho", "Have an idea, a question, or just a hello? Get in touch."),
};

export default function ContactPage() {
    return <ContactClient />;
}
