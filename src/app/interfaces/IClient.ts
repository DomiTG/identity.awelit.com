export default interface IClient {
    id: number;
    name: string;
    title: string;
    description: string;
    client_id: string;
    client_secret: string;
    redirect_uris: string[];   
}