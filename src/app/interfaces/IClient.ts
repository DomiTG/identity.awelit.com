export default interface IClient {
    id: number;
    name: string;
    title: string;
    tos_url: string;
    privacy_url: string;
    description: string;
    client_id: string;
    client_secret: string;
    redirect_uris: string[];   
}