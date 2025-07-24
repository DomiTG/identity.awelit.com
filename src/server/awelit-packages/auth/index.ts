import axios from 'axios';

interface AuthUser {
    id: string;
    email_address: string;
    created_at: string;
    updated_at: string;
}

export class AwelitAuth {
    
    url: string = 'https://identity.awelit.com/api';
    refreshToken: string | null = null;
    accessToken: string | null = null;

    constructor(

    ) {
        this.refreshToken = null;
        this.accessToken = null;
    }

    setAccessToken(token: string) {
        this.accessToken = token;
    }

    setRefreshToken(token: string) {
        this.refreshToken = token;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    async refresh(): Promise<AuthUser> {
        if (!this.refreshToken) {
            throw new Error("No refresh token available");
        }
        const response = await axios.post(`${this.url}/refresh`, {
            headers: {
                Authorization: `Bearer ${this.refreshToken}`
            }
        });

        const { accessToken, user } = response.data;

        this.setAccessToken(accessToken);

        return user as AuthUser;
    }

}