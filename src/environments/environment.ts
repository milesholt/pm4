// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBAhZc4AJgvSwMyEyQH04q3DRa8tuJK9mU',
    authDomain: 'project-manager-2045e.firebaseapp.com',
    databaseURL: 'https://project-manager-2045e.firebaseio.com',
    projectId: 'project-manager-2045e',
    storageBucket: 'project-manager-2045e.appspot.com',
    messagingSenderId: '1026315619936',
    appId: '1:1026315619936:android:ce09d8440aea1dca',
  },
  ig: {
    IG_DEMO_USERNAME: 'milesholt_demo2',
    IG_DEMO_PASSWORD: 'Savelli_1986',
    IG_DEMO_API_KEY: '3fe3a5a3a41355df513eda0ec98230da7d7d9a9e',
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
