﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NbThemeModule, NbLayoutModule, NbChatModule} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {ChatComponent} from './chat/chat.component';
import {HttpClientModule} from '@angular/common/http';
import {UserService} from './chat.service';
import {FormsModule} from '@angular/forms';
import {NgxNotificationModule} from 'ngx-notification';

@NgModule({
  declarations: [AppComponent, ChatComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,
    HttpClientModule,
    FormsModule,
    NgxNotificationModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
