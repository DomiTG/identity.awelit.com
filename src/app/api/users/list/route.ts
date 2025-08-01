import prisma from "@/server/db";

export async function GET(
    req: Request,
) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return new Response("Unauthorized", { status: 401 });
    }
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [client_id, client_secret] = credentials.split(":");
    if (!client_id || !client_secret) {
        console.log("Invalid credentials format");
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const client = await prisma.clients.findFirst({
            where: {
                client_id: client_id,
                client_secret: client_secret,
            },
        });
        if (!client) {
            return new Response("Unauthorized", { status: 401 });
        }
        const users = await prisma.client_users.findMany({
            where: {
                client_id: client.id,
            },
            select: {
                id: true,
                email_address: true,
                created_at: true,
                updated_at: true,
            }
        });
        return new Response(JSON.stringify({ users }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch(err) {
        console.error("Error listing clients:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}