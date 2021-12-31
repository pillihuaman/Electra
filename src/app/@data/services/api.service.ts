import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) { }

  requestFilter(request: any): string {
    let api = '';
    Object.keys(request).forEach((key) => {
      const oldVal = request[key];
      const newVal =
        oldVal || oldVal === 0
          ? typeof oldVal === 'string'
            ? oldVal.trim()
            : oldVal
          : null;
      if (newVal || newVal === 0) {
        api += `${key}=${newVal}&`;
      }
    });
    api = api.substr(0, api.length - 1);
    return api;
  }

  public formatErrors(err: HttpErrorResponse) {
    const messageError = err.error ? err.error : err;
    if (
      err &&
      err.error &&
      err.error.status &&
      err.error.status.error &&
      err.error.status.error.messages
    ) { }
    return throwError(messageError);
  }

  get(path: string, params?: any): Observable<any> {
    return this.http.get(path, { params }).pipe(
      catchError((error) => {
        ;
        //mensje
        return this.formatErrors(error);
      })
    );
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http.put(path, body).pipe(
      catchError((error) => {
        //mensje
        return this.formatErrors(error);
      })
    );
  }

  patch(path: string, body: object = {}): Observable<any> {
    return this.http.patch(path, body).pipe(
      catchError((error) => {
        //mensje
        return this.formatErrors(error);
      })
    );
  }

  post(path: string, body: any): Observable<any> {
    //
    return this.http.post(path, body).pipe(
      catchError((error) => {

        //mensje
        return this.formatErrors(error);
      })
    );
  }

  putHTML(path: string, body: object = {}): Observable<any> {
    return this.http
      .put(path, body, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          //mensje
          return this.formatErrors(error);
        })
      );
  }

  postHTML(path: string, body: object = {}): Observable<any> {
    return this.http
      .post(path, body, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          //mensje
          return this.formatErrors(error);
        })
      );
  }

  getHTML(path: string): Observable<any> {
    return this.http
      .get(path, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          //mensje
          return this.formatErrors(error);
        })
      );
  }

  delete(path: string): Observable<any> {
    return this.http.delete(path).pipe(
      catchError((error) => {
        //mensje
        return this.formatErrors(error);
      })
    );
  }

}
