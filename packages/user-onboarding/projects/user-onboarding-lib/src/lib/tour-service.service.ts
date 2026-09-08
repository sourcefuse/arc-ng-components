// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {TourStoreServiceService} from './tour-store-service.service';
import {
  ApplicationRef,
  Injectable,
  EnvironmentInjector,
  createComponent,
} from '@angular/core';
import Shepherd from 'shepherd.js';
import {
  Tour,
  TourButton,
  TourStep,
  TourState,
  FilterFunction,
  Props,
  Status,
  TourStepChange,
  TourComplete,
  TourCancel,
  ComponentStep,
} from '../models';
import {Router, NavigationEnd, Event as NavigationEvent} from '@angular/router';
import {Subject} from 'rxjs';
import {DEFAULT_MAX_WAIT_TIME, INTERVAL} from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class TourServiceService {
  private readonly tourComplete = new Subject<TourComplete>();
  tourComplete$ = this.tourComplete.asObservable();
  private readonly tourStepChange = new Subject<TourStepChange>();
  tourStepChange$ = this.tourStepChange.asObservable();
  private readonly tourCancel = new Subject<TourCancel>();
  tourCancel$ = this.tourCancel.asObservable();
  private readonly interval = INTERVAL;
  private _maxWaitTime = DEFAULT_MAX_WAIT_TIME;
  private _exitOnEsc = true;
  private readonly tourFailed = new Subject<{
    tourId: string;
    message: string;
  }>();
  tourFailed$ = this.tourFailed.asObservable();

  // The tour instance is created during the tour execution flow,
  // not when the service is constructed.
  private tour!: Shepherd.Tour;

  constructor(
    private readonly tourStoreService: TourStoreServiceService,
    private readonly router: Router,
    private readonly injector: EnvironmentInjector,
    private readonly appRef: ApplicationRef,
  ) {}

  public set maxWaitTime(maxTime: number) {
    if (maxTime > 0) {
      this._maxWaitTime = maxTime;
    }
  }

  public get maxWaitTime() {
    return this._maxWaitTime;
  }

  public set exitOnEsc(esc: boolean) {
    this._exitOnEsc = esc;
  }

  public get exitOnEsc() {
    return this._exitOnEsc;
  }
  private addRemovedSteps(removedSteps:TourStep[]): void {
    const count = removedSteps.length;
    for (let i = 0; i < count; i++) {
      // pop() can return undefined when the steps array is empty,
      // so add the step back only when a step is available.
      const step = this.tour.steps.pop();

      if (step) {
        this.tour.steps.splice(0, 0, step);
      }
    }
  }

  getTour() {
    return this.tour;
  }

  private actionAssignment(
    e: TourStep,
    b: TourButton,
    wrapperNormalNext: () => void,
    wrapperNormalPrev: () => void,
    wrapperNext: () => void,
    wrapperPrev: () => void,
    func: () => void,
    tourId: string,
    props: Props,
  ): void {
    if (b.key === 'prevAction') {
      // Fixed: Wrapped functions to return the action as expected by shepherd.js type definition
      b.action = () =>
        e.prevRoute === e.currentRoute ? wrapperNormalPrev : wrapperPrev;
    } else if (b.key === 'nextAction') {
      // Fixed: Wrapped functions to return the action as expected by shepherd.js type definition
      b.action = () =>
        e.nextRoute === e.currentRoute ? wrapperNormalNext : wrapperNext;
    } else {
      // Fixed: Wrapped bind result to return the action as expected by shepherd.js type definition
      b.action = () => func.bind({tour: this.tour, tourId, props});
    }
  }

  private waitForElement(
    tourStep: TourStep,
    tourId: string,
  ): Promise<Element | ''> {
    if (tourStep.attachTo === undefined) {
      return Promise.resolve('');
    } else {
      const startTime = new Date().getTime();
      return new Promise<Element | ''>((resolve, reject) => {
        const timer = setInterval(() => {
          const now = new Date().getTime();
          const element = this.checkElement(tourStep.attachTo);
          if (element) {
            clearInterval(timer);
            resolve(element);
          } else if (now - startTime >= this._maxWaitTime) {
            clearInterval(timer);
            reject({tourId, message: `Error in loading tour`});
          } else {
            // do nothing
          }
        }, this.interval);
      });
    }
  }

  private triggerTour(tourInstance: Tour, props: Props): void {
    let removedSteps: TourStep[] = [];
    const sessionId = this.tourStoreService.getSessionId();
    if (!sessionId) {
      this.tourStoreService.generateSessionId();
    }
    this.tourStoreService
      .loadState({tourId: tourInstance.tourId, sessionId})
      .subscribe(tourState => {
        if (tourState && Object.keys(tourState).length) {
          if (tourState.status === Status.Complete) {
            return;
          }
          removedSteps = this.getRemovedSteps(
            tourInstance.tourSteps,
            tourState,
          );
          tourInstance.tourSteps = this.getTourSteps(
            tourInstance.tourSteps,
            tourState,
          );
        } else {
          tourState = {
            sessionId: this.tourStoreService.getSessionId(),
            step: tourInstance.tourSteps[0].id,
            props,
            status: Status.InProgress,
          };
          this.tourStoreService
            .saveState({
              tourId: tourInstance.tourId,
              state: tourState,
            })
            .subscribe();
        }
        tourInstance.tourSteps.forEach((e, index) => {
          // Fixed: Added null check for buttons array before forEach
          e.buttons?.forEach(b => {
            const key = b.key;
            // Fixed: Added type assertion for key and func since getFnByKey returns Function but we need () => void
            const func = this.tourStoreService.getFnByKey(key as string) as () => void;
            const wrapperNext = () => {
              this.navigateAndMoveToNextStep(e, tourInstance, tourState, index);
            };
            const wrapperPrev = () => {
              this.navigateAndMoveToPrevStep(
                e,
                tourInstance,
                tourState,
                index,
                removedSteps,
              );
            };
            const wrapperNormalNext = () => {
              this.moveToNextStep(tourInstance, tourState, e, index);
            };
            const wrapperNormalPrev = () => {
              this.moveToPrevStep(
                tourInstance,
                tourState,
                e,
                index,
                removedSteps,
              );
            };
            this.actionAssignment(
              e,
              b,
              wrapperNormalNext,
              wrapperNormalPrev,
              wrapperNext,
              wrapperPrev,
              func,
              tourInstance.tourId,
              // Fixed: tourState.props is guaranteed to exist here as we set it above
              tourState.props ?? {},
            );
          });
        });
        this.tour.addSteps(tourInstance.tourSteps);
        this.waitForElement(
          tourInstance.tourSteps[0],
          tourInstance.tourId,
        ).then(
          element => {
            if (element) {
              element.scrollIntoView(true);
            }
            this.tour.start();
            if (removedSteps.length) {
              removedSteps.forEach((er, index) => {
                // Fixed: Added null check for buttons array before forEach
                er.buttons?.forEach(br => {
                  const k = br.key;
                  // Fixed: Added type assertion for key and func since getFnByKey returns Function but we need () => void
                  const funcRemoved = this.tourStoreService.getFnByKey(k as string) as () => void;
                  const wrapperNextRemoved = () => {
                    this.navigateAndMoveToNextStepRemoved(
                      er,
                      tourInstance,
                      tourState,
                      index,
                      removedSteps,
                    );
                  };
                  const wrapperPrevRemoved = () => {
                    this.navigateAndMoveToPrevStepRemoved(
                      er,
                      tourInstance,
                      tourState,
                      index,
                      removedSteps,
                    );
                  };
                  const wrapperNormalNextRemoved = () => {
                    this.moveToNextStepRemoved(
                      tourInstance,
                      tourState,
                      er,
                      index,
                      removedSteps,
                    );
                  };
                  const wrapperNormalPrevRemoved = () => {
                    this.moveToPrevStepRemoved(
                      tourInstance,
                      tourState,
                      er,
                      index,
                      removedSteps,
                    );
                  };
                  this.actionAssignment(
                    er,
                    br,
                    wrapperNormalNextRemoved,
                    wrapperNormalPrevRemoved,
                    wrapperNextRemoved,
                    wrapperPrevRemoved,
                    funcRemoved,
                    tourInstance.tourId,
                    // Fixed: tourState.props is guaranteed to exist here as we set it above
                    tourState.props ?? {},
                  );
                });
              });
              this.tour.addSteps(removedSteps);
              this.addRemovedSteps(removedSteps);
            }
          },
          err => {
            this.tourFailed.next(err);
          },
        );
      });
  }

  public run(
    tourId: string,
    params?: {[key: string]: string},
    props?: Props,
    filterFn?: FilterFunction,
    inputs?: object,
  ): void {
    this.tourStoreService
      .loadTour({
        tourId,
        sessionId: this.tourStoreService.getSessionId(),
      })
      .subscribe(tourInstance => {
        this.checkAndThrowError(tourInstance);
        if (params) {
          let steps = JSON.stringify(tourInstance.tourSteps);

          Object.keys(params).forEach(key => {
            steps = steps.replace(
              new RegExp(`\\{\\{${key}\\}\\}`),
              params[key],
            );
          });
          tourInstance.tourSteps = JSON.parse(steps);
        }
        this.tour = new Shepherd.Tour({
          useModalOverlay: true,
          exitOnEsc: this._exitOnEsc,
          defaultStepOptions: {
            cancelIcon: {
              enabled: true,
            },
            scrollTo: {behavior: 'smooth', block: 'center'},
          },
        });
        this.tour.on('complete', (event: TourComplete) => {
          event.tourId = tourInstance.tourId;
          this.tourComplete.next(event);
        });

        // on pressing esc cancel event is emitted by shepherd
        this.tour.on('cancel', (event: TourCancel) => {
          event.tourId = tourInstance.tourId;
          this.tourCancel.next(event);
        });

        if (filterFn) {
          tourInstance.tourSteps = filterFn(tourInstance.tourSteps);
        }
        if (tourInstance.tourSteps[0].attachTo) {
          tourInstance.tourSteps[0].attachTo.scrollTo = false;
        }
        // Fixed: Added null check for inputs parameter
        this.checkComponents(tourInstance, inputs ?? {}).then(() => {
          // Fixed: Added null check for props parameter
          this.triggerTour(tourInstance, props ?? {});
        });
      });
  }
  private async checkComponents(tourInstance: Tour, inputs: object) {
    for (const step of tourInstance.tourSteps) {
      if (typeof step.text !== 'string' && typeof step.text !== 'function') {
        const htmlStep = await this.parseComponent(
          {
            forStep: step.id,
            component: this.tourStoreService.getComponentByKey(
              step.text.component,
            ),
          },
          inputs,
        );
        step.text = htmlStep.html;
      }
    }
  }
  // Fixed: Added null check for attachTo parameter and proper type handling
  private checkElement(attachTo: TourStep['attachTo']) {
    // Fixed: Added null check for attachTo
    if (!attachTo) {
      return false;
    }
    switch (attachTo.type) {
      case 'string':
        return document.querySelector(attachTo.element as string);

      case 'element':
        return attachTo.element as Element;

      case 'function':
        // Fixed: Type is guaranteed to be string here due to switch case
        const fn = this.tourStoreService.getFnByKey(attachTo.element as string);
        return fn() as Element;

      default:
        return false;
    }
  }
  private getRemovedSteps(tourSteps: TourStep[], tourState: TourState) {
    let f = true;
    return tourSteps.filter(e => {
      if (e.id === tourState.step || !f) {
        f = false;
      }
      return f;
    });
  }
  private getTourSteps(tourSteps: TourStep[], tourState: TourState) {
    let flag = false;
    return tourSteps.filter(e => {
      if (e.id === tourState.step || flag) {
        flag = true;
      }
      return flag;
    });
  }
  private pauseAllVideos() {
    document.querySelectorAll('video').forEach(vid => vid.pause());
  }
  setTourComplete(tourId: string, props: Props) {
    this.tourStoreService
      .saveState({
        tourId,
        state: {
          sessionId: this.tourStoreService.getSessionId(),
          step: '',
          props,
          status: Status.Complete,
        },
      })
      .subscribe();
  }
  private checkAndThrowError(tourInstance: Tour) {
    if (!tourInstance) {
      throw new Error(`No Tour Present`);
    } else if (tourInstance.tourSteps.length === 0) {
      throw new Error(`No Tour Steps Found`);
    } else if (tourInstance.tourSteps[0].buttons) {
      tourInstance.tourSteps[0].buttons.forEach(button => {
        if (button.key === `prevAction`) {
          throw new Error(`Step 1 can't have a previous button`);
        }
      });
    } else {
      //do nothing
    }
  }
  private moveToNextStep(
    tourInstance: Tour,
    tourState: TourState,
    step: TourStep,
    index: number,
  ) {
    if (index === tourInstance.tourSteps.length - 1) {
      // Fixed: Added null check for props
      this.setTourComplete(tourInstance.tourId, tourState.props ?? {});
      this.tour.next();
    } else {
      this.waitForElement(
        tourInstance.tourSteps[index + 1],
        tourInstance.tourId,
      ).then(
        () => {
          this.tourStoreService
            .saveState({
              tourId: tourInstance.tourId,
              state: {
                sessionId: this.tourStoreService.getSessionId(),
                step: step.nextStepId,
                props: tourState.props,
                status: Status.InProgress,
              },
            })
            .subscribe();

          this.tour.show(step.nextStepId);
          this.tourStepChange.next({
            tourId: tourInstance.tourId,
            currentStepId: step.nextStepId,
            previousStepId: step.id,
            moveForward: true,
          });
          this.pauseAllVideos();
        },
        err => {
          this.tourFailed.next(err);
        },
      );
    }
  }

  private moveToPrevStep(
    tourInstance: Tour,
    tourState: TourState,
    step: TourStep,
    index: number,
    removedSteps: TourStep[],
  ) {
    let waitForLastElementOfRemovedSteps = false;
    if (index === 0 && removedSteps.length) {
      waitForLastElementOfRemovedSteps = true;
    }
    this.waitForElement(
      waitForLastElementOfRemovedSteps
        ? removedSteps[removedSteps.length - 1]
        : tourInstance.tourSteps[index - 1],
      tourInstance.tourId,
    ).then(
      () => {
        this.tourStoreService
          .saveState({
            tourId: tourInstance.tourId,
            state: {
              sessionId: this.tourStoreService.getSessionId(),
              step: waitForLastElementOfRemovedSteps
                ? removedSteps[removedSteps.length - 1].id
                : step.prevStepId,
              props: tourState.props,
              status: Status.InProgress,
            },
          })
          .subscribe();
        if (waitForLastElementOfRemovedSteps) {
          this.tour.show(removedSteps[removedSteps.length - 1].id);
        } else {
          this.tour.show(step.prevStepId);
        }
        this.tourStepChange.next({
          tourId: tourInstance.tourId,
          currentStepId: waitForLastElementOfRemovedSteps
            ? removedSteps[removedSteps.length - 1].id
            : step.prevStepId,
          previousStepId: step.id,
          moveForward: false,
        });
        this.pauseAllVideos();
      },
      err => {
        this.tourFailed.next(err);
      },
    );
  }

  private moveToNextStepRemoved(
    tourInstance: Tour,
    tourState: TourState,
    step: TourStep,
    index: number,
    removedSteps: TourStep[],
  ) {
    let waitForFirstElementOfSteps = false;

    if (index === removedSteps.length - 1) {
      waitForFirstElementOfSteps = true;
    }
    this.waitForElement(
      waitForFirstElementOfSteps
        ? tourInstance.tourSteps[0]
        : removedSteps[index + 1],
      tourInstance.tourId,
    ).then(
      () => {
        this.tourStoreService
          .saveState({
            tourId: tourInstance.tourId,
            state: {
              sessionId: this.tourStoreService.getSessionId(),
              step: waitForFirstElementOfSteps
                ? tourInstance.tourSteps[0].id
                : step.nextStepId,
              props: tourState.props,
              status: Status.InProgress,
            },
          })
          .subscribe();
        if (waitForFirstElementOfSteps) {
          this.tour.show(tourInstance.tourSteps[0].id);
        } else {
          this.tour.show(step.nextStepId);
        }
        this.tourStepChange.next({
          tourId: tourInstance.tourId,
          currentStepId: waitForFirstElementOfSteps
            ? tourInstance.tourSteps[0].id
            : step.nextStepId,
          previousStepId: step.id,
          moveForward: true,
        });
        this.pauseAllVideos();
      },
      err => {
        this.tourFailed.next(err);
      },
    );
  }

  private moveToPrevStepRemoved(
    tourInstance: Tour,
    tourState: TourState,
    step: TourStep,
    index: number,
    removedSteps: TourStep[],
  ) {
    this.waitForElement(removedSteps[index - 1], tourInstance.tourId).then(
      () => {
        this.tourStoreService
          .saveState({
            tourId: tourInstance.tourId,
            state: {
              sessionId: this.tourStoreService.getSessionId(),
              step: step.prevStepId,
              props: tourState.props,
              status: Status.InProgress,
            },
          })
          .subscribe();
        this.tour.show(step.prevStepId);
        this.tourStepChange.next({
          tourId: tourInstance.tourId,
          currentStepId: step.prevStepId,
          previousStepId: step.id,
          moveForward: false,
        });
        this.pauseAllVideos();
      },
      err => {
        this.tourFailed.next(err);
      },
    );
  }
  private navigateAndMoveToNextStep(
    currentStep: TourStep,
    tourInstance: Tour,
    tourState: TourState,
    index: number,
  ) {
    if (index < tourInstance.tourSteps.length - 1) {
      this.router.navigate([currentStep.nextRoute]);
      this.router.events.subscribe((event: NavigationEvent) => {
        const nextStep = tourInstance.tourSteps.filter(
          ts => ts.id === currentStep.nextStepId,
        )[0];
        if (
          event instanceof NavigationEnd &&
          event.url === nextStep.currentRoute
        ) {
          this.moveToNextStep(tourInstance, tourState, currentStep, index);
        }
      });
    } else {
      this.moveToNextStep(tourInstance, tourState, currentStep, index);
    }
  }
  private navigateAndMoveToPrevStep(
    currentStep: TourStep,
    tourInstance: Tour,
    tourState: TourState,
    index: number,
    removedSteps: TourStep[],
  ) {
    let moveToLastRemovedStep = false;
    if (index === 0 && removedSteps.length) {
      moveToLastRemovedStep = true;
    }
    const prevRoute = moveToLastRemovedStep
      ? removedSteps[removedSteps.length - 1].prevRoute
      : currentStep.prevRoute;
    this.router.navigate([prevRoute]);
    this.router.events.subscribe((event: NavigationEvent) => {
      let prevStep: TourStep;
      if (moveToLastRemovedStep) {
        prevStep = removedSteps[removedSteps.length - 1];
      } else {
        prevStep = tourInstance.tourSteps.filter(
          ts => ts.id === currentStep.prevStepId,
        )[0];
      }

      if (
        event instanceof NavigationEnd &&
        event.url === prevStep.currentRoute
      ) {
        this.moveToPrevStep(
          tourInstance,
          tourState,
          currentStep,
          index,
          removedSteps,
        );
      }
    });
  }
  private navigateAndMoveToNextStepRemoved(
    currentStep: TourStep,
    tourInstance: Tour,
    tourState: TourState,
    index: number,
    removedSteps: TourStep[],
  ) {
    let moveToFirstStep = false;

    if (index === removedSteps.length - 1) {
      moveToFirstStep = true;
    }
    const nextRoute = moveToFirstStep
      ? tourInstance.tourSteps[0].nextRoute
      : currentStep.nextRoute;
    this.router.navigate([nextRoute]);
    this.router.events.subscribe((event: NavigationEvent) => {
      let nextStep: TourStep;
      if (moveToFirstStep) {
        nextStep = tourInstance.tourSteps[0];
      } else {
        nextStep = tourInstance.tourSteps.filter(
          ts => ts.id === currentStep.nextStepId,
        )[0];
      }

      if (
        event instanceof NavigationEnd &&
        event.url === nextStep.currentRoute
      ) {
        this.moveToNextStepRemoved(
          tourInstance,
          tourState,
          currentStep,
          index,
          removedSteps,
        );
      }
    });
  }
  private navigateAndMoveToPrevStepRemoved(
    currentStep: TourStep,
    tourInstance: Tour,
    tourState: TourState,
    index: number,
    removedSteps: TourStep[],
  ) {
    this.router.navigate([currentStep.prevRoute]);
    this.router.events.subscribe((event: NavigationEvent) => {
      const prevStep = tourInstance.tourSteps.filter(
        ts => ts.id === currentStep.prevStepId,
      )[0];
      if (
        event instanceof NavigationEnd &&
        event.url === prevStep.currentRoute
      ) {
        this.moveToPrevStepRemoved(
          tourInstance,
          tourState,
          currentStep,
          index,
          removedSteps,
        );
      }
    });
  }
  // Fixed: Updated to use Angular 22's createComponent API instead of deprecated ComponentFactoryResolver
  // Fixed: Added proper type for input parameter with index signature
  private parseComponent(step: ComponentStep, input: {[key: string]: any}) {
    return Promise.resolve({
      forStep: step.forStep,
      html: () => {
        // Fixed: Using the new createComponent API instead of deprecated ComponentFactoryResolver
        const constructedComponent = createComponent(step.component, {
          environmentInjector: this.injector,
        });
        // Fixed: Added index signature to input type and proper type checking
        Object.keys(input ?? {}).forEach(k => {
          (constructedComponent.instance as any)[k] = input[k];
        });
        (constructedComponent.instance as any)['tour'] = this.tour;
        this.appRef.attachView(constructedComponent.hostView);
        return constructedComponent.location.nativeElement;
      },
    });
  }
}
