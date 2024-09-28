// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'https://localhost:44341/api/',
  identityServerUrl: 'https://localhost:44310/',
  identityServerAdminUrl: 'https://localhost:44303/',
  clientId: 'catalyst_spa',
  redirectUri: 'https://localhost:4200/auth-callback',
  postLogoutRedirectUri: 'https://localhost:4200/',
  ecommercespa: 'https://localhost:4200',
  apiUrl2: 'http://localhost:3000/', // for local json server testing
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
