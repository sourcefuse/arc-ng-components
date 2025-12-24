// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  Inject,
  input,
  OnDestroy,
  OnInit,
  Optional,
  output,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {Configuration} from '../lib-configuration';
import {Subject} from 'rxjs';
import {debounceTime, tap} from 'rxjs/operators';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  CustomSearchEvent,
  ISearchService,
  ISearchQuery,
  SEARCH_SERVICE_TOKEN,
  DEBOUNCE_TIME,
  DEFAULT_LIMIT,
  DEFAULT_LIMIT_TYPE,
  DEFAULT_OFFSET,
  DEFAULT_SAVE_IN_RECENTS,
  DEFAULT_ORDER,
  IReturnType,
  RecentSearchEvent,
  TypeEvent,
  ItemClickedEvent,
  IModel,
  ISearchServiceWithPromises,
  isApiServiceWithPromise,
} from '../types';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {PromiseApiAdapterService} from './promise-api-adapter.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
const ALL_LABEL = 'All';
@Component({
  selector: 'sourceloop-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchComponent,
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class SearchComponent<T extends IReturnType>
  implements OnInit, OnDestroy, ControlValueAccessor
{
  readonly cfg = computed(() => {
    const cfg = this.config();
    if (!cfg) {
      throw new Error('SearchComponent: config input is required');
    }
    return cfg;
  });
  config = input<Configuration<T>>();
  searchProvider = input<ISearchService<T> | ISearchServiceWithPromises<T>>();

  titleTemplate = input<TemplateRef<any> | undefined>();
  subtitleTemplate = input<TemplateRef<any> | undefined>();

  customAllLabel = input<string>(ALL_LABEL);
  showOnlySearchResultOverlay = input<boolean>(false);

  customSearchEvent = input<CustomSearchEvent>({
    searchValue: '',
    modelName: ALL_LABEL,
  });

  clicked = output<ItemClickedEvent<T>>();
  searched = output<RecentSearchEvent>();

  searchBoxInput = '';
  suggestionsDisplay = false;
  categoryDisplay = false;
  searching = false;
  suggestions: T[] = [];
  recentSearches: ISearchQuery[] = [];
  category: string = ALL_LABEL;
  searchRequest$ = new Subject<{input: string; event: Event}>();

  private searchService!: ISearchService<T>;

  onChange: (value: string | undefined) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;

  @ViewChild('searchInput') public searchInputElement!: ElementRef;

  constructor(
    @Inject(SEARCH_SERVICE_TOKEN)
    @Optional()
    searchService: ISearchService<T>,
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID)
    private readonly platformId: Object,
    private readonly cdr: ChangeDetectorRef,
    private readonly promiseAdapter: PromiseApiAdapterService<T>,
  ) {
    if (searchService) {
      this.searchService = searchService;
    }

    effect(() => {
      const cfg = this.config();
      if (!cfg) return;

      if (cfg.models) {
        cfg.models.unshift({
          name: ALL_LABEL,
          displayName: this.customAllLabel(),
        });
      } else {
        cfg.models = [
          {
            name: ALL_LABEL,
            displayName: this.customAllLabel(),
          },
        ];
      }
    });

    effect(() => {
      let provider = this.searchProvider();
      if (!provider) return;

      if (isApiServiceWithPromise(provider)) {
        provider = this.promiseAdapter.adapt(provider);
      }
      this.searchService = provider;
    });

    effect(() => {
      const event = this.customSearchEvent();
      if (!event) return;

      if (event.searchValue !== undefined) {
        this.searchBoxInput = event.searchValue;
        this.searchOnCustomEventValueChange(this.searchBoxInput);
      }

      if (event.modelName) {
        this.setCategory(event.modelName);
      }
    });
  }

  ngOnInit(): void {
    this.searchRequest$
      .pipe(
        tap(v => (this.suggestions = [])),
        debounceTime(DEBOUNCE_TIME),
      )
      .subscribe((value: TypeEvent) => {
        this.searched.emit({
          event: value.event,
          keyword: value.input,
          category: this.category,
        });
        this.getSuggestions(value);
        this.cdr.markForCheck();
      });
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    this.searchBoxInput = value;
  }
  // When the value in the UI is changed, this method will invoke a callback function
  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getSuggestions(eventValue: TypeEvent) {
    const cfg = this.config();
    if (!cfg) return;
    eventValue.input = eventValue.input.trim();
    if (!eventValue.input.length) {
      return;
    }
    const order = cfg.order ?? DEFAULT_ORDER;
    const orderString = order.join(' ');
    // let orderString = '';
    // order.forEach(preference => (orderString = `${orderString}${preference} `));

    let saveInRecents = cfg.saveInRecents ?? DEFAULT_SAVE_IN_RECENTS;
    if (cfg.saveInRecents && cfg.saveInRecentsOnlyOnEnter) {
      if (
        !eventValue.event ||
        (eventValue.event instanceof KeyboardEvent &&
          eventValue.event.key === 'Enter')
      ) {
        saveInRecents = true; // save in recents only on enter or change in category
      } else {
        // do not save in recent search on typing
        saveInRecents = false;
      }
    }
    const requestParameters: ISearchQuery = {
      match: eventValue.input,
      sources: this._categoryToSourceName(this.category),
      limit: cfg.limit ?? DEFAULT_LIMIT,
      limitByType: cfg.limitByType ?? DEFAULT_LIMIT_TYPE,
      order: orderString,
      offset: cfg.offset ?? DEFAULT_OFFSET,
    };

    this.searching = true;
    this.cdr.markForCheck();
    this.searchService
      .searchApiRequest(requestParameters, saveInRecents)
      .subscribe(
        (value: T[]) => {
          this.suggestions = value;
          this.searching = false;
          this.cdr.markForCheck();
        },
        (_error: Error) => {
          this.suggestions = [];
          this.searching = false;
          this.cdr.markForCheck();
        },
      );
  }
  getRecentSearches() {
    const cfg = this.config();
    if (!cfg || cfg.hideRecentSearch) return;
    this.searchService.recentSearchApiRequest?.().subscribe(
      (value: ISearchQuery[]) => {
        this.recentSearches = value;
        this.cdr.markForCheck();
      },
      (_error: Error) => {
        this.recentSearches = [];
        this.cdr.markForCheck();
      },
    );
  }

  hitSearchApi(event?: Event) {
    // this will happen only in case user searches something and
    // then erases it, we need to update recent search
    const cfg = this.config();
    if (!cfg) return;
    if (!this.searchBoxInput) {
      this.suggestions = [];
      this.getRecentSearches();
      return;
    }

    // no debounce time needed in case of searchOnlyOnEnter
    if (cfg.searchOnlyOnEnter) {
      if (!event || (event instanceof KeyboardEvent && event.key === 'Enter')) {
        this.getSuggestions({input: this.searchBoxInput, event});
      }
      return;
    }

    // no debounce time needed in case of change in category
    if (!event) {
      this.getSuggestions({input: this.searchBoxInput, event});
      return;
    }

    this.searchRequest$.next({
      input: this.searchBoxInput,
      event,
    });
  }

  populateValue(suggestion: T, event: MouseEvent) {
    const cfg = this.config();
    if (!cfg) return;
    this.searchBoxInput = String(suggestion[cfg.displayPropertyName]);
    // converted to string to assign value to searchBoxInput
    // this.searchBoxInput = value;
    this.suggestionsDisplay = false;
    // ngModelChange doesn't detect change in value
    // when populated from outside, hence calling manually
    this.onChange(this.searchBoxInput);
    // need to do this to show more search options for selected
    //suggestion - just in case user reopens search input
    this.getSuggestions({input: this.searchBoxInput, event});
    this.clicked.emit({item: suggestion, event});
  }
  populateValueRecentSearch(recentSearch: ISearchQuery, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const value = recentSearch['match'];
    this.searchBoxInput = value;
    this.suggestionsDisplay = false;
    this.onChange(this.searchBoxInput);
    // need to do this to show more search options for selected
    // suggestion - just in case user reopens search input
    this.getSuggestions({input: this.searchBoxInput, event});
    this.focusInput();
    this.showSuggestions();
  }

  fetchModelImageUrlFromSuggestion(suggestion: T) {
    const modelName = suggestion[
      'source' as unknown as keyof T
    ] as unknown as string;
    let url: string | undefined;
    this.config()?.models.forEach(model => {
      if (model.name === modelName && model.imageUrl) {
        url = model.imageUrl;
      }
    });
    return url;
  }

  boldString(str: T[keyof T] | string, substr: string) {
    const strRegExp = new RegExp(`(${substr})`, 'gi');
    const stringToMakeBold: string = str as unknown as string;
    return stringToMakeBold.replace(strRegExp, `<b>$1</b>`);
  }

  hideSuggestions() {
    this.suggestionsDisplay = false;
    this.onTouched();
  }

  showSuggestions() {
    this.suggestionsDisplay = true;
    this.getRecentSearches();
  }

  focusInput() {
    if (
      isPlatformBrowser(this.platformId) &&
      !this.showOnlySearchResultOverlay()
    ) {
      this.searchInputElement.nativeElement.focus();
    }
  }

  setCategory(category: string) {
    this.category = category;
    this.categoryDisplay = false;
    if (this.searchBoxInput) {
      this.hitSearchApi();
      this.focusInput();
      this.showSuggestions();
    }
  }

  showCategory() {
    this.categoryDisplay = !this.categoryDisplay;
  }

  hideCategory() {
    this.categoryDisplay = false;
  }

  resetInput() {
    this.searchBoxInput = '';
    this.suggestions = [];
    this.suggestionsDisplay = true;
    this.focusInput();
    // ngModelChange doesn't detect change in value
    // when populated from outside, hence calling manually
    this.onChange(this.searchBoxInput);
    this.getRecentSearches();
  }
  ngOnDestroy() {
    this.searchRequest$.unsubscribe();
  }

  _categoryToSourceName(category: string) {
    if ([ALL_LABEL, this.customAllLabel()].includes(category)) {
      return [];
    } else {
      return [category];
    }
  }
  getModelFromModelName(name: string) {
    return this.config()?.models.find(item => item.name === name) as IModel;
  }
  getModelsWithSuggestions() {
    const modelsWithSuggestions: {model: IModel; items: T[]}[] = [];
    const sources: string[] = [];
    this.suggestions.forEach(suggestion => {
      if (sources.indexOf(suggestion['source']) >= 0) {
        modelsWithSuggestions.every(modelWithSuggestions => {
          if (modelWithSuggestions.model.name === suggestion['source']) {
            modelWithSuggestions.items.push(suggestion);
            return false;
          }
          return true;
        });
      } else {
        const model = this.getModelFromModelName(suggestion['source']);
        modelsWithSuggestions.push({model, items: [suggestion]});
        sources.push(suggestion['source']);
      }
    });
    return modelsWithSuggestions;
  }

  searchOnCustomEventValueChange(value: string) {
    if (value?.length) {
      this.showSuggestions();
      this.hitSearchApi();
    } else {
      this.hideSuggestions();
    }
  }

  private _isCustomSearchEventChange(
    changes: SimpleChanges,
    propertyName: string,
  ) {
    return (
      !changes.customSearchEvent?.previousValue ||
      changes.customSearchEvent?.previousValue[propertyName] !==
        changes.customSearchEvent?.currentValue[propertyName]
    );
  }
}