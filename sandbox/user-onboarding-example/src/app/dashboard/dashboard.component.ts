// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {TourId} from '../tour.constant';
import {TourService} from '../tour.service';
import {HeroSearchComponent} from '../hero-search/hero-search.component';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [HeroSearchComponent, CommonModule, RouterLink],
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  disablePointerEvents: boolean;
  constructor(
    private readonly heroService: HeroService,
    private readonly tourService: TourService,
  ) {}

  ngOnInit(): void {
    this.getHeroes();
    this.tourService.runTour(TourId.DashboardTour);
    this.tourService.tourRunning$.subscribe(tourState => {
      this.disablePointerEvents = tourState;
    });
  }

  getHeroes(): void {
    const lowerLimit = 1;
    const upperLimit = 5;
    this.heroService
      .getHeroes()
      .subscribe(
        heroes => (this.heroes = heroes.slice(lowerLimit, upperLimit)),
      );
  }
}
