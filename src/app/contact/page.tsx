import type { Metadata } from "next";
import ContactClient from "./ContactClient";

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
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
