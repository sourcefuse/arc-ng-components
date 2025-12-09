// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component} from '@angular/core';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {TokenInputComponent} from './token-input/token-input.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [SearchBarComponent, TokenInputComponent],
})
export class AppComponent {
  title = 'search-client-example';
}
