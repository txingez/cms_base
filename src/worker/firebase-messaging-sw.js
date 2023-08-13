// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here. Other Firebase libraries
// // are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
//
// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// firebase.initializeApp({
//     apiKey: import.meta.env.ENV_FIREBASE_APIKEY,
//     authDomain: import.meta.env.ENV_FIREBASE_AUTH_DOMAIN,
//     databaseURL: 'https://project-id.firebaseio.com',
//     projectId: import.meta.env.ENV_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.ENV_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.ENV_FIREBASE_MESSAGE_SENDER_ID,
//     appId: import.meta.env.ENV_FIREBASE_APP_ID,
//     measurementId: import.meta.env.ENV_FIREBASE_MEASUREMENT_ID
// });
//
// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();
//
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('../firebase-messaging-sw.js')
//         .then((registration) => {
//             console.log('Registration successful, scope is: ', registration.scope);
//         })
//         .catch((err) => {
//             console.log('Service worker registration failed, error: ', err)
//         });
// }
