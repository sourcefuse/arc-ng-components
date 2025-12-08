// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {SEARCH_SERVICE_TOKEN} from '@sourceloop/search-client';
import {AppComponent} from './app/app.component';
import {SearchService} from './app/search.service';
import {LocalStorageService} from './app/local-storage.service';

bootstrapApplication(AppComponent, {
  providers: [
    {provide: SEARCH_SERVICE_TOKEN, useClass: SearchService},
    LocalStorageService,

    provideHttpClient(), 
    provideAnimations(),
  ],
}).catch(err => console.error(err));
