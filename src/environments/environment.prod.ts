// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA4MovvYg4hn40t78B8rFYY2CN4yequ1I0',
    authDomain: 'brand-builder-ai.firebaseapp.com',
    databaseURL: 'https://brand-builder-ai.firebaseio.com',
    projectId: 'brand-builder-ai',
    storageBucket: 'brand-builder-ai.appspot.com',
    messagingSenderId: '1026315619936',
    appId: '1:1026315619936:android:ce09d8440aea1dca',
  },
  ig: {
    IG_DEMO_USERNAME: 'milesholt_demo2',
    IG_DEMO_PASSWORD: 'Savelli_1986',
    IG_DEMO_API_KEY: '3fe3a5a3a41355df513eda0ec98230da7d7d9a9e',
  },
  stripe: {
    publicTestKey:
      'pk_test_51PnCeRLAUexwVL9foWee6REcNpBUNz4iSKDpaQ4pLNfKHqBi0iKnjFGfvVbEaWhWcsTlLB0LENTilRaEPYz2ccqH00lck5iZAi',
    publicLiveKey:
      'pk_live_51PnCeRLAUexwVL9fY0yhq1faiChvjrCgUjvGUurZU3JnoLdqwRxUDp6HaKDzjg33Uk9y9hsKJe9MxT9nRIJCq5If00ai2cdQw5',
  },
  ai: {
    web: {
      client_id:
        '994750726007-jq48o9daubr7il1tvduimkc985jt6s9j.apps.googleusercontent.com',
      project_id: 'ai-project-1-428513',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_secret: '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',
    },
    gemini: {
      API_KEY: 'AIzaSyBSBb3MeOjZVv3Jv5iWmqN-InCRj3mcnf8',
    },
  },
  google: {
    apiKey: 'AIzaSyA4MovvYg4hn40t78B8rFYY2CN4yequ1I0',
    drive: {
      web: {
        client_id:
          '398310527509-ui04p8ppukh1tsmhq1b4nqonpekq6d0n.apps.googleusercontent.com',
        project_id: 'brand-builder-ai',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: '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',
        redirect_uris: [
          'https://brand-builder-ai.firebaseapp.com/__/auth/handler',
        ],
        javascript_origins: [
          'http://localhost',
          'http://localhost:5000',
          'https://brand-builder-ai.firebaseapp.com',
        ],
      },
    },
  },
  url: 'https://obscura.solutions',
  title: 'Obscura Solutions',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
