// app/api/admin/login/route.ts

export async function POST(req: Request) {
    try {
        const { passcode } = await req.json();

        const correctPasscode = process.env.ADMIN_PASSCODE;

        if (!correctPasscode) {
            return Response.json(
                { success: false, error: "Admin passcode is not configured." },
                { status: 500 }
            );
        }

        if (passcode?.toLowerCase() === correctPasscode.toLowerCase()) {
            return Response.json({ success: true });
        }

        return Response.json(
            { success: false, error: "Incorrect passcode." },
            { status: 401 }
        );
    } catch {
        return Response.json(
            { success: false, error: "Invalid request." },
            { status: 400 }
        );
    }
}