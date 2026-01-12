import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ICommand} from './i-command';
import { ApiService } from '../services';
import { IAdapter } from '../adapters';

declare type HttpObserve = 'body' | 'events' | 'response';
declare type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export abstract class GetAPICommand<T, R = T> implements ICommand {
  constructor(
    protected readonly apiService: ApiService,
    protected readonly adapter: IAdapter<T, R>,
    protected readonly uri: string,
  ) {}

  parameters?: {
    query?: HttpParams;
    headers?: HttpHeaders;
    observe?: HttpObserve;
    responseType?: ResponseType;
  };

  execute(): Observable<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let options: any;
    if (this.parameters) {
      options = {};
      options.observe = this.parameters.observe || 'body';

      if (this.parameters.headers) {
        options.headers = this.parameters.headers;
      }

      if (this.parameters.query) {
        options.params = this.parameters.query;
      }

      if (this.parameters.responseType) {
        options.responseType = this.parameters.responseType;
      }
    }
    return this.apiService
      .get(this.uri, options)
      .pipe(map(resp => this.adapter.adaptToModel(resp)));
  }
}
