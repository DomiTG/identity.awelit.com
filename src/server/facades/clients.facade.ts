import IClient from "@/app/interfaces/IClient";
import prisma from "../db";

export const listClients = async (): Promise<IClient[]> => {
    const clients = await prisma.clients.findMany();
    return clients.map((client) => ({
        id: client.id,
        name: client.name,
        tos_url: client.tos_url,
        privacy_url: client.privacy_url,
        title: client.title,
        description: client.description,
        client_id: client.client_id,
        client_secret: client.client_secret,
        redirect_uris: client.redirect_uris ? client.redirect_uris.split(",") : [],
    }));
}

export const getClientById = async (client_id: string): Promise<IClient | null> => {
    const client = await prisma.clients.findFirst({
        where: {
            client_id: client_id,
        },
    });
    if (!client) {
        return null;
    }
    return {
        id: client.id,
        name: client.name,
        title: client.title,
        description: client.description,
        client_id: client.client_id,
        client_secret: client.client_secret,
        redirect_uris: client.redirect_uris ? client.redirect_uris.split(",") : [],
        tos_url: client.tos_url,
        privacy_url: client.privacy_url,
    };
}