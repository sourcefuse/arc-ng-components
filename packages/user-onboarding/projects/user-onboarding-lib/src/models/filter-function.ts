﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {TourStep} from './tour-step';

export type FilterFunction = (steps: TourStep[]) => TourStep[];
