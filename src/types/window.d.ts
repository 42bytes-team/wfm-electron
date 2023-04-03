import type { CurrentUser } from 'src/oauth2';
import type { Authorized } from 'src/preload';

declare global {
    interface Window {
        api: {
            onAuthorized: (callback: Authorized) => void;
            removeAuthorizedListener: (callback: Authorized) => void;
            getCurrentUser: () => Promise<CurrentUser | null>;
            authorize: () => Promise<void>;
            getData: (key: string) => Promise<string>;
        };
    }
}

export {};
