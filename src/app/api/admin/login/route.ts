import { createAdminToken, COOKIE_NAME, TOKEN_TTL_MS } from "@/lib/auth";

// Simple in-memory rate limiter (resets on server restart — adequate for a personal site)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: Request): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = attempts.get(ip);

    if (!entry || now > entry.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }

    entry.count += 1;
    if (entry.count > MAX_ATTEMPTS) return true;
    return false;
}

function clearAttempts(ip: string): void {
    attempts.delete(ip);
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);

        if (isRateLimited(ip)) {
            return Response.json(
                { success: false, error: "Too many attempts. Try again in 15 minutes." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { passcode } = body;

        if (typeof passcode !== "string" || passcode.length === 0) {
            return Response.json(
                { success: false, error: "Invalid request." },
                { status: 400 }
            );
        }

        const correctPasscode = process.env.ADMIN_PASSCODE;

        if (!correctPasscode) {
            return Response.json(
                { success: false, error: "Admin passcode is not configured." },
                { status: 500 }
            );
        }

        // Case-sensitive, constant-time comparison
        const { timingSafeEqual } = await import("crypto");
        const a = Buffer.from(passcode);
        const b = Buffer.from(correctPasscode);

        let match = false;
        if (a.length === b.length) {
            match = timingSafeEqual(a, b);
        }

        if (!match) {
            return Response.json(
                { success: false, error: "Incorrect passcode." },
                { status: 401 }
            );
        }

        // Clear rate limit on success
        clearAttempts(ip);

        const token = createAdminToken();

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${Math.floor(TOKEN_TTL_MS / 1000)}; SameSite=Strict`,
            },
        });
    } catch {
        return Response.json(
            { success: false, error: "Invalid request." },
            { status: 400 }
        );
    }
}