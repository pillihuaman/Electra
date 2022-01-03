import { ModalRepository } from 'src/app/@domain/repository/modal.repository';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, concatMap, map, mergeMap, timeout } from 'rxjs/operators';
import { Const } from './const';
import { AuthenticationRepository } from '../../@domain/repository/authentication.repository';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from 'src/app/@domain/models/user';
import { ApiService } from './api.service';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/utils/utils';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends AuthenticationRepository {
  clearUser(): void {
    localStorage.clear();
    this.currentUserSubject.next(null!);
  }
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public defaultHeaders = new HttpHeaders();
  private applicationRoles = [];
  private userRoles = [];

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private apiService: ApiService,
    private modalService: ModalRepository
  ) {
    super();
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('usuario')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(login: string, clave: string): Observable<any> {
    this.currentUserSubject.next(null!);
    return this.verifyCredentials(login, clave).pipe(
      catchError((e) => {
        if (!Utils.empty(e)) {
          if (!Utils.empty(e.status)) {
            if (e.status === 400) {
              if (!Utils.empty(e.error)) {
                if (!Utils.empty(e.error.detail)) {
                  Swal.fire({
                    icon: 'error',
                    title: e.error.detail,
                    text: 'Error al autenticar',
                    //footer: '<a href="">Error al autenticar</a>',
                  });
                }
              }
            }
          }
        }
        //   this.modalService.create();
        return e;
        // throw e;
      })
    );
  }

  verifyCredentials(login: string, clave: string): Observable<any> {
    localStorage.clear();
    const userName = Const.USERNAME_SEGURIDAD;
    const password = Const.PASSWORD_SEGURIDAD;

    let headers = new HttpHeaders();
    let body: any = { email: login, password: clave };
    let httpHeaderAccepts: string[] = [
      'text/plain',
      'application/json',
      'text/json',
    ];
    const consumes: string[] = [
      'application/json',
      'text/json',
      'application/_*+json',
    ];
    headers = headers.set('Accept', httpHeaderAccepts);
    headers = headers.set('Content-Type', consumes);
    const url = `${Const.API_SEGURIDAD}/Account/authenticate`;
    return this.http.post<any>(url, body, { headers: headers }).pipe(
      timeout(2000),
      map((response: any) => {
        const usuario = response.userName;
        localStorage.setItem('currentUser', usuario);
        this.currentUserSubject.next({
          token: response.jwToken,
        });
        localStorage.setItem('token', response.jwToken);

        return response;
      }),
      catchError((e) => {
        this.router.navigate(['/auth/']);
        throw e;
      })
    );
  }
}
