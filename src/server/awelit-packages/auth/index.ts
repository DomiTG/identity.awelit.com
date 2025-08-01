import axios from 'axios';

export interface AwelitAuthUser {
    id: number;
    email_address: string;
    created_at: Date;
    updated_at: Date;
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

    async refresh(): Promise<AwelitAuthUser> {
        if (!this.refreshToken) {
            throw new Error("No refresh token available");
        }
        const startTime = Date.now();
        const response = await axios(
            {
                "url": `${this.url}/refresh`,
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.refreshToken}`
                }
            }
        )

        const { accessToken, user } = response.data;
        console.log("Token refreshed in", Date.now() - startTime, "ms");
        this.setAccessToken(accessToken);

        return user as AwelitAuthUser;
    }

}