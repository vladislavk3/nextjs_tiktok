import { useState, useEffect } from "react";
import Container from '@material-ui/core/Container'
import Typography from "@material-ui/core/Typography";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SignInCheck from 'components/sign_in_check'

export default function User() {
    const [subscription, setSubscription] = useState({subscribed: false})
    useEffect(() => {        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service_worker.js')
                .then(() => initialiseState(setSubscription));
        } else {
            console.log('Service workers aren\'t supported in this browser.');
        }            
    }, [])

    return (
        <SignInCheck>
            <Container maxWidth="sm"> 
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox checked={subscription?.subscribed} onChange={handleClick(setSubscription)}name="subscription"color="primary" />
                        }
                        label={<>
                            <Typography variant="body1" color="textPrimary">
                                Get TikTok Performance Notifications
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Get notified if your videos do unusually
                                well or we notice an opportunity for improvement
                            </Typography></>}
                    />
                </FormGroup>
            </Container>
        </SignInCheck>
    )
}

const handleClick = (setSubscription) => (event) => {
    event.target.checked ? subscribe() : unsubscribe();
    setSubscription({subscribed: event.target.checked})
}

function unsubscribe() {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        // To unsubscribe from push messaging, you need get the
        // subcription object, which you can call unsubscribe() on.
        serviceWorkerRegistration.pushManager.getSubscription().then(
            function (pushSubscription) {
                // Check we have a subscription to unsubscribe
                if (!pushSubscription) {
                    // No subscription object, so set the state
                    // to allow the user to subscribe to push
                    console.log('no subscription')
                    return;
                }
                // We have a subcription, so call unsubscribe on it
                pushSubscription.unsubscribe().then(function () {
                    sendSubscriptionToServer(pushSubscription, true)
                }).catch(function (e) {
                    // We failed to unsubscribe, this can lead to
                    // an unusual state, so may be best to remove
                    // the subscription id from your data store and
                    // inform the user that you disabled push

                    console.log('Unsubscription error: ', e);
                });
            }).catch(function (e) {
                console.log('Error thrown while unsubscribing from ' +
                    'push messaging.', e);
            });
    });
}

function sendSubscriptionToServer(subscription, expired) {
    const url = '/api/user/session/add_push_subscription?' + 
        (expired ? 'expired=true' : '')
    return fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    });
}

function subscribe() {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(async function (subscription) {
                if (subscription) {
                    return subscription;
                }
                const convertedVapidKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC);

                return serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });
            }).then(sendSubscriptionToServer)
            .catch(function (e) {
                if (Notification.permission === 'denied') {
                    // The user denied the notification permission which
                    // means we failed to subscribe and the user will need
                    // to manually change the notification permission to
                    // subscribe to push messages
                    console.log('Permission for Notifications was denied');
                } else {
                    // A problem occurred with the subscription, this can
                    // often be down to an issue or lack of the gcm_sender_id
                    // and / or gcm_user_visible_only
                    console.log('Unable to subscribe to push.', e);
                }
            });
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function initialiseState(setSubscription) {
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.log('Notifications aren\'t supported.');
        return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.');
        return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.');
        return;
    }

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                if (!subscription) {
                    // We aren’t subscribed to push, so set UI
                    // to allow the user to enable push
                    return setSubscription({ capable: true });
                }
                // Keep your server in sync with the latest subscription
                sendSubscriptionToServer(subscription);
                setSubscription({ subscribed: true })
            })
            .catch(function (err) {
                console.log('Error during getSubscription()', err);
            });
    });
}