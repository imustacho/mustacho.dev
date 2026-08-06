import { isAdminAuthorized } from "@/lib/auth";

export async function GET() {
    const authorized = await isAdminAuthorized();
    if (!authorized) {
        return Response.json({ authorized: false }, { status: 401 });
    }
    return Response.json({ authorized: true });
}
