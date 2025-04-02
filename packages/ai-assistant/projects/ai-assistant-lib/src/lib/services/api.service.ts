/* eslint-disable @typescript-eslint/no-explicit-any */
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  public get(url: string, options?: object): Observable<any> {
    return this.http.get(`${url}`, options);
  }

  public patch(
    url: string,
    payload: any | null,
    options?: object,
  ): Observable<any> {
    return this.http.patch(`${url}`, payload, options);
  }

  public post(
    url: string,
    payload: any | null,
    options?: object,
  ): Observable<any> {
    return this.http.post(`${url}`, payload, options);
  }

  public delete(url: string, options?: object): Observable<any> {
    return this.http.delete(`${url}`, options);
  }
}
