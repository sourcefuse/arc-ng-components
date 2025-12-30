// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';
import {MessageService} from '../message.service';
import {TourService} from '../tour.service';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [CommonModule],
})
export class MessagesComponent implements OnInit {
  constructor(
    public readonly messageService: MessageService,
    private readonly tourService: TourService,
  ) {}
  disablePointerEvents: boolean;
  ngOnInit() {
    this.tourService.tourRunning$.subscribe(tourState => {
      this.disablePointerEvents = tourState;
    });
  }
}