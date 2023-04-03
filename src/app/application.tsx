import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './application.module.scss';
import { Authorize } from './authorize';
import { CurrentUser } from './user';

const App = () => {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        window.api.getData('deviceId').then((data) => {
            setDeviceId(data);
        });
    }, []);

    return (
        <>
            <h1>Welcome to the WFM demo app</h1>
            <div className={styles.main}>
                {deviceId !== null && (
                    <span>
                        Your deviceID is: <b>{deviceId}</b>
                    </span>
                )}
                <Authorize />
            </div>
            <div className={styles.user}>
                <CurrentUser />
            </div>
        </>
    );
};

const domNode = document.getElementById('react');
if (!domNode) {
    throw new Error('Cannot find DOM node with id "react"');
}

const root = createRoot(domNode);

root.render(<App />);
