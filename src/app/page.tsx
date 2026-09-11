import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
    title: "Mustacho — Developer & Student",
    description: "Personal website and portfolio of Mustacho. Developer building Discord bots, AI tools, desktop applications, and web experiments.",
    alternates: {
        canonical: "/",
    },
};

export default function Home() {
    return <HomeClient />;
}