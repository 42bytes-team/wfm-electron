import { useEffect, useState } from 'react';

interface User {
    id: number;
    ingameName: string;
    avatar: string;
    role: string;
}

export const CurrentUser = () => {
    const [user, setUser] = useState<User | null>(null);

    // If we already have token, we can request user data
    // If not it will return null anyway
    useEffect(() => {
        window.api.getCurrentUser().then((data) => {
            setUser(data);
        });
    }, []);

    // When main process will accept code and state, parse them and exchnage for access token
    // it will trigger onAuthorized callback, to notify this component that process is done.
    // That means we can use token to request user data and display it
    useEffect(() => {
        const action = () => {
            window.api.getCurrentUser().then((data) => {
                setUser(data);
            });
        };

        window.api.onAuthorized(action);
        return () => {
            window.api.removeAuthorizedListener(action);
        };
    });

    return (
        <div>
            {user !== null && (
                <div>
                    <div>id: {user.id}</div>
                    <div>ingameName: {user.ingameName}</div>
                    <div>avatar: {user.avatar}</div>
                    <div>role: {user.role}</div>
                </div>
            )}
            {user === null && <div>Unauthorized</div>}
        </div>
    );
};
