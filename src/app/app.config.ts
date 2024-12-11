import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { OKTA_CONFIG, OktaAuthModule, OktaAuthStateService, OktaCallbackComponent } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import OktaSignIn from '@okta/okta-signin-widget';

const oktaAuth = new OktaAuth(myAppConfig.oidc);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
              {provide: OKTA_CONFIG, useValue: {oktaAuth}},OktaAuthStateService,OktaCallbackComponent,
              importProvidersFrom(OktaAuthModule)
  ]
};
