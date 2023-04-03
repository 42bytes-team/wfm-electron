import * as crypto from 'crypto';
import { shell } from 'electron';
import { generateRandomString } from './random';

function sha256(buffer: crypto.BinaryLike) {
    return crypto.createHash('sha256').update(buffer).digest();
}

export interface OauthCredentials {
    client_id: string;
    device_id: string;
    redirect_uri: string;
    scopes: string[];
}

export interface OauthTokens {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number;
    tokenType?: string;
}

export interface CurrentUser {
    id: number;
    ingameName: string;
    avatar: string;
    role: string;
}

export interface Response<T> {
    api_version: string;
    data: T | null;
    error: string | null;
}

class OAuthBuilder {
    challenge: string;
    codeVerifier: string;
    state: string;
    credentials: OauthCredentials;
    tokens: OauthTokens;

    constructor(credentials: OauthCredentials, tokens: OauthTokens) {
        this.challenge = '';
        this.codeVerifier = '';
        this.state = '';
        this.credentials = credentials;
        this.tokens = tokens;
    }

    private generateCodeChallenge() {
        this.codeVerifier = generateRandomString(128);
        this.challenge = Buffer.from(sha256(this.codeVerifier)).toString('base64');
    }

    /**
     * Use app\\client credentials to build authroization url \
     * then open it in default browser
     */
    authorize() {
        this.generateCodeChallenge();
        this.state = generateRandomString(128);
        const searchParams = new URLSearchParams({
            client_id: this.credentials.client_id,
            redirect_uri: this.credentials.redirect_uri,
            response_type: 'code',
            scope: 'orders inventory',
            code_challenge: this.challenge,
            code_challenge_method: 'S256',
            state: this.state,
            device_id: this.credentials.device_id,
        });

        const url = `https://warframe.market/auth/authorize?${searchParams.toString()}`;
        shell.openExternal(url);
    }

    /**
     * If user approved our request we will be redirected to our application with some extra params attached. \
     * Parse url, get code and state \
     * Then exchange code for tokens
     */
    async parseAndGetTokens(url: string): Promise<OauthTokens | null> {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
        const state = urlObj.searchParams.get('state');
        if (code == null || state == null) return null;

        const jsonBody = {
            client_id: this.credentials.client_id,
            grant_type: 'authorization_code',
            redirect_uri: this.credentials.redirect_uri,
            code: code,
            code_verifier: this.codeVerifier,
        };

        return fetch('http://api.warframe.market/v2/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonBody),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json().then((data) => {
                        this.tokens.accessToken = data.access_token;
                        this.tokens.refreshToken = data.refresh_token;
                        this.tokens.expiresAt = Math.floor(Date.now() / 1000) + data.expiresIn;
                        this.tokens.tokenType = data.token_type;
                        return {
                            accessToken: this.tokens.accessToken,
                            refreshToken: this.tokens.refreshToken,
                            expiresAt: this.tokens.expiresAt,
                            tokenType: this.tokens.tokenType,
                        };
                    });
                }

                console.error('Code:', response.status);
                console.error(
                    'Body:',
                    response.text().then((data) => console.log(data))
                );

                return null;
            })
            .catch((error) => {
                console.error('Error:', error);
                return null;
            });
    }

    /**
     * Getting current user info by using our freshly (or not) acquired access token \
     */
    async getCurrentUser(): Promise<CurrentUser | null> {
        if (this.tokens.accessToken == null) return null;
        return fetch('http://api.warframe.market/v2/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.tokens.accessToken}`,
            },
        })
            .then<CurrentUser | null>((response) => {
                if (response.status === 200) {
                    return response.json().then((json: Response<CurrentUser>) => {
                        console.log(json);
                        return json.data;
                    });
                }

                console.error('Code:', response.status);
                console.error(
                    'Body:',
                    response.text().then((data) => console.log(data))
                );

                return null;
            })
            .catch((error) => {
                console.error('Error:', error);
                return null;
            });
    }
}

export default OAuthBuilder;
