﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import Shepherd from 'shepherd.js';

export type TourCancel = {
  index: number;
  tour: Shepherd.Tour;
  tourId: string;
};
