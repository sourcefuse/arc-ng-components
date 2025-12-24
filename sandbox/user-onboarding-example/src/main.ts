// // Copyright (c) 2023 Sourcefuse Technologies
// //
// // This software is released under the MIT License.
// // https://opensource.org/licenses/MIT
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';

import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {FakeBackendHttpInterceptor} from './app/fake-backend-http.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {routes} from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // ✔ Only router provider
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendHttpInterceptor,
      multi: true,
    },
  ],
});