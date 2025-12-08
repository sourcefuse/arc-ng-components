// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component} from '@angular/core';
import {LocalStorageService} from '../local-storage.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
@Component({
  standalone: true,
  selector: 'app-token-input',
  templateUrl: './token-input.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class TokenInputComponent {
  token: string;
  tokenSet: boolean;
  constructor(private readonly localStorageService: LocalStorageService) {
    this.token = '';
    this.tokenSet = false;
  }
  onSubmit() {
    this.localStorageService.set('token', this.token);
    this.tokenSet = true;
    this.token = '';
  }
}
