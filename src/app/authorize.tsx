import { useCallback, useEffect, useState } from 'react';
import styles from './authorize.module.scss';

export const Authorize = () => {
    const [processing, setProcessing] = useState(false);

    // User pressed the button, so we are updating state to refled that
    const authorize = useCallback(async () => {
        setProcessing(true);
        await window.api.authorize();
    }, []);

    // When main process will accept code and state, parse them and exchnage for access token
    // it will trigger onAuthorized callback, to notify this component that process is done.
    useEffect(() => {
        const done = () => {
            setProcessing(false);
        };

        window.api.onAuthorized(done);
        return () => {
            window.api.removeAuthorizedListener(done);
        };
    });

    return (
        <div>
            {processing && <span>Waiting response from the site...</span>}
            {!processing && (
                <section className={styles.authorize}>
                    <label htmlFor='name'>Authorize through warframe.market</label>
                    <button id='name' onClick={authorize}>
                        Authorize
                    </button>
                </section>
            )}
        </div>
    );
};
