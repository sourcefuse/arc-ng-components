// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component} from '@angular/core';
import {MessagesComponent} from './messages/messages.component';
import {ResetComponent} from './reset/reset.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MessagesComponent,
    ResetComponent,
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
  ],
})
export class AppComponent {
  title = 'User Onboarding Example - TOURS';
}