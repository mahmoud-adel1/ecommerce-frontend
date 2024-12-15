import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OKTA_CONFIG, OktaAuthModule, OktaAuthStateService, OktaCallbackComponent } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { AuthInterceptorService } from './services/auth-interceptor.service';

const oktaAuth = new OktaAuth(myAppConfig.oidc);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptorsFromDi()),
              {provide: OKTA_CONFIG, useValue: {oktaAuth}},OktaAuthStateService,OktaCallbackComponent,
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
              importProvidersFrom(OktaAuthModule)
  ]
};
