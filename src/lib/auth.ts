import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSCODE || "fallback-secret-change-me";
const COOKIE_NAME = "mustacho_admin_token";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function sign(payload: string): string {
    return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createAdminToken(): string {
    const expires = Date.now() + TOKEN_TTL_MS;
    const payload = `admin:${expires}`;
    const sig = sign(payload);
    return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
    try {
        const lastDot = token.lastIndexOf(".");
        if (lastDot === -1) return false;

        const payload = token.substring(0, lastDot);
        const sig = token.substring(lastDot + 1);

        const expectedSig = sign(payload);

        // Timing-safe comparison to prevent timing attacks
        if (sig.length !== expectedSig.length) return false;
        const sigBuf = Buffer.from(sig, "hex");
        const expectedBuf = Buffer.from(expectedSig, "hex");
        if (sigBuf.length !== expectedBuf.length) return false;
        if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

        const parts = payload.split(":");
        if (parts.length !== 2 || parts[0] !== "admin") return false;

        const expires = parseInt(parts[1], 10);
        if (isNaN(expires) || Date.now() > expires) return false;

        return true;
    } catch {
        return false;
    }
}

/** Call this in any API route handler to guard it. Returns true if authorized. */
export async function isAdminAuthorized(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return false;
        return verifyAdminToken(token);
    } catch {
        return false;
    }
}

export { COOKIE_NAME, TOKEN_TTL_MS };
