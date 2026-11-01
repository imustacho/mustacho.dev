import { getSocialCards } from "@/lib/social-cards";
import { renderSocialImage } from "@/lib/render-social-image";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return getSocialCards().map(card => ({
        slug: card.path === "/" ? ["home"] : card.path.slice(1).split("/"),
    }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const path = slug.join("/") === "home" ? "/" : `/${slug.join("/")}`;
    const card = getSocialCards().find(card => card.path === path);

    if (!card) return new Response("Not found", { status: 404 });

    return renderSocialImage(card);
}
