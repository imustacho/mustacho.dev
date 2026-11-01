import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SOCIAL_IMAGE_SIZE } from "@/lib/social-image";
import type { SocialCard } from "@/lib/social-cards";

const ink = "#955623";
const muted = "#7a451b";
const paper = "#f5efe6";

const mustachePath = "M6720 5963 c-266 -26 -415 -82 -850 -319 -439 -239 -707 -312 -1180 -321 -285 -6 -290 -7 -290 -72 1 -126 106 -329 252 -486 468 -501 1323 -703 2078 -490 279 78 523 206 808 422 178 135 144 133 289 18 143 -113 326 -230 466 -300 498 -245 1080 -291 1632 -129 355 105 661 293 849 523 116 142 216 343 216 434 0 78 0 78 -302 81 -295 3 -394 16 -615 80 -194 57 -323 115 -658 297 -324 175 -479 233 -699 259 -249 30 -517 -37 -754 -187 -65 -41 -212 -154 -232 -178 -22 -26 -47 -17 -129 49 -302 244 -589 348 -881 319z";

function Mustache({ width }: { width: number }) {
    return (
        // The original tight viewBox crops the lower curves; include padding on all sides.
        <svg width={width} height={width * 240 / 740} viewBox="400 390 740 240" fill={ink}>
            <g transform="translate(0,1024) scale(0.1,-0.1)">
                <path d={mustachePath} />
            </g>
        </svg>
    );
}

function shorten(text: string, max: number) {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= max) return normalized;
    const excerpt = normalized.slice(0, max - 1);
    const lastSpace = excerpt.lastIndexOf(" ");
    return `${excerpt.slice(0, lastSpace > max * 0.7 ? lastSpace : excerpt.length)}…`;
}

export async function renderSocialImage(card: SocialCard) {
    const [heading, body] = await Promise.all([
        readFile(join(process.cwd(), "src/assets/fonts/dynapuff-semibold.ttf")),
        readFile(join(process.cwd(), "src/assets/fonts/fredoka-regular.ttf")),
    ]);
    const title = shorten(card.title, 110);
    const titleSize = title.length > 70 ? 47 : title.length > 38 ? 57 : title.length > 22 ? 70 : 90;

    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: paper, color: ink, fontFamily: "Fredoka", padding: "46px 64px", position: "relative", overflow: "hidden" }}>
                <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
                    <path d="M-110 310C55 280 120 150 23 120C-50 98-70 222 70 241C170 255 190 345 137 409" stroke={ink} strokeWidth="30" opacity="0.045" fill="none" />
                    <path d="M-110 310C55 280 120 150 23 120C-50 98-70 222 70 241C170 255 190 345 137 409" stroke={ink} strokeWidth="1.5" opacity="0.16" fill="none" />
                    <path d="M1110-80C950 62 1060 124 1175 97C1280 72 1320 200 1168 249" stroke={ink} strokeWidth="32" opacity="0.05" fill="none" />
                    <path d="M1110-80C950 62 1060 124 1175 97C1280 72 1320 200 1168 249" stroke={ink} strokeWidth="1.5" opacity="0.18" fill="none" />
                    <path d="M770 676C830 500 1100 650 1127 478" stroke={ink} strokeWidth="1.5" opacity="0.18" fill="none" />
                </svg>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <Mustache width={50} />
                        <span style={{ fontFamily: "DynaPuff", fontWeight: 600, fontSize: 26, letterSpacing: -1 }}>mustacho</span>
                    </div>
                    <span style={{ color: muted, fontSize: 22 }}>{card.path === "/" ? "/home" : shorten(card.path, 56)}</span>
                </div>

                <div style={{ display: "flex", flex: 1, alignItems: "center", position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: 770, paddingBottom: 8 }}>
                        <span style={{ fontSize: 17, letterSpacing: 3, color: muted, marginBottom: 22 }}>{shorten(card.label, 58)}</span>
                        <div style={{ display: "flex", fontFamily: "DynaPuff", fontSize: titleSize, fontWeight: 600, letterSpacing: -3, lineHeight: 1.12, maxWidth: 770, overflowWrap: "anywhere" }}>{title}</div>
                        <div style={{ display: "flex", fontSize: 27, lineHeight: 1.4, color: muted, marginTop: 24, maxWidth: 690, whiteSpace: "pre-wrap" }}>{shorten(card.description, title.length > 70 ? 130 : 175)}</div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", right: -12, top: 90, width: 270, height: 270, border: "1px solid #d7bfa8", borderRadius: "50%", background: "#ede4d8", transform: "rotate(-12deg)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 240, height: 240, border: "1px dashed #c8a98d", borderRadius: "50%" }}>
                            <Mustache width={210} />
                        </div>
                        <div style={{ display: "flex", position: "absolute", bottom: 10, right: -4, alignItems: "center", justifyContent: "center", background: ink, color: paper, border: `6px solid ${paper}`, borderRadius: 24, width: 90, height: 80, fontSize: 34, fontFamily: "DynaPuff", fontWeight: 600, transform: "rotate(20deg)" }}>{card.symbol}</div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #d7bfa8", paddingTop: 22, fontSize: 21 }}>
                    <span style={{ color: muted }}>{shorten(card.detail, 75)}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 23 }}>
                        <span>mustacho.dev</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 19L19 5M5 5H19V19" />
                        </svg>
                    </div>
                </div>
            </div>
        ),
        {
            ...SOCIAL_IMAGE_SIZE,
            fonts: [
                { name: "DynaPuff", data: heading, weight: 600, style: "normal" },
                { name: "Fredoka", data: body, weight: 400, style: "normal" },
            ],
        },
    );
}
