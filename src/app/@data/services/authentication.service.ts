import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, concatMap, map, mergeMap, timeout } from 'rxjs/operators';
import { Const } from './const';
import { AuthenticationRepository } from '../../@domain/repository/authentication.repository';

//import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from 'src/app/@domain/models/user';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends AuthenticationRepository {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<User>;
  public defaultHeaders = new HttpHeaders();
  private applicationRoles = [];
  private userRoles = [];

  constructor(
    private http: HttpClient,
    //private jwtHelper: JwtHelperService,
    private router: Router,
    private apiService: ApiService
  ) {
    super();
    // Falta el endpoint de obtener data de usuario por mientras sera del api persona
    //this.currentUserSubject = new BehaviorSubject<User>(
    //  JSON.parse(localStorage.getItem('persona'))
    //);
    //this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(login: string, clave: string): Observable<any> {
    //this.currentUserSubject.next(null);
    return this.verifyCredentials(login, clave).pipe(
      catchError((e) => {
        throw e;
      })
    );
  }

  verifyCredentials(login: string, clave: string): Observable<any> {
    localStorage.clear();
    const userName = Const.USERNAME_SEGURIDAD;
    const password = Const.PASSWORD_SEGURIDAD;

let headers = new HttpHeaders();
let body:any={"email": "jlopez.j87@gmail.com", "password": "123Pa$$word!"}
let httpHeaderAccepts: string[] = [
  'text/plain',
  'application/json',
  'text/json'
];
const consumes: string[] = [
  'application/json',
  'text/json',
  'application/_*+json'
];
headers = headers.set('Accept', httpHeaderAccepts);
headers = headers.set('Content-Type', consumes);
    const url = `${Const.API_SEGURIDAD}/Account/authenticate`;
    return this.http
      .post<any>(url, body,{headers:headers}
         )
      .pipe(
        timeout(2000),
        map((response: any) => {
          const usuario = response.userName;
          localStorage.setItem('currentUser', usuario);
          //this.currentUserSubject.next({
            //numeroDocumento: Number(usuario),
            //token: response.jwToken,
         // });
          localStorage.setItem('token', response.jwToken);
      
          return response;
        }),
        catchError((e) => {
          if (e.code === 'PTMP') {
            localStorage.setItem('userDocument', login);
            this.router.navigateByUrl('/home/change-password');
          }
          throw e;
        })
      );

  }
  /*
  {
    "id": "bd511b7f-b1ca-4306-8c41-a7d6803bf6d0",
    "name": "Jorge Lopez",
    "userName": "jorgeGG",
    "email": "jlopez.j87@gmail.com",
    "roles": [
        "Basic"
    ],
    "jwToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb3JnZUdHIiwianRpIjoiOTQzMzY3ZTItNjhlNy00MmNlLTlkMTMtZWQ4MDEwMTBhNTg4IiwiZW1haWwiOiJqbG9wZXouajg3QGdtYWlsLmNvbSIsInVpZCI6ImJkNTExYjdmLWIxY2EtNDMwNi04YzQxLWE3ZDY4MDNiZjZkMCIsInJvbGVzIjoiQmFzaWMiLCJleHAiOjE2NDA5NDQwNTksImlzcyI6IkNvcmVJZGVudGl0eSIsImF1ZCI6IkNvcmVJZGVudGl0eVVzZXIifQ.K_YElm_h_Fd_AoVP8QqrN8M6-tI01oGQwQ_v-L7rgoA",
    "refreshToken": "olUuHFvupWQfVooSj7KH6qSs1188qGI8AQriQrkA9Tw=",
    "refreshTokenExpiration": "2021-12-31T03:47:39.7298935-05:00"
}*/





  forgotPassword(numeroDocumento: string): Observable<any> {
    //this.currentUserSubject.next(null);

    const userName = Const.USERNAME_SEGURIDAD;
    const password = Const.PASSWORD_SEGURIDAD;
    const codigo = `${btoa(
      unescape(encodeURIComponent(userName + ':' + password))
    )}`;
    const url = `${Const.API_SEGURIDAD}v1/oauth2/password/reset`;

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${codigo}`,
    });

    const tramaEnvio = {
      trace: {
        traceId: 'string',
      },
      payload: {
        usuario: numeroDocumento,
        urlSistema: `${window.location.href.split('auth')[0]}auth/login`,
      },
    };

    return this.http.put(url, tramaEnvio, { headers }).pipe(
      timeout(5000),
      catchError((e) => {
        throw e;
      })
    );
  }

  changePassword(password: string, newPassword: string): Observable<any> {
    const user = Const.USERNAME_SEGURIDAD;
    const pass = Const.PASSWORD_SEGURIDAD;
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Basic ${btoa(unescape(encodeURIComponent(user + ':' + pass)))}`
      ),
    };
    const params = {
      trace: {
        traceId: null,
      },
      payload: {
        usuario: localStorage.getItem('userDocument') || localStorage.getItem('currentUser') || null,
        passwordActual: password,
        passwordNuevo: newPassword,
      },
    };
    return this.http.put(
      `${Const.API_SEGURIDAD}v1/oauth2/password/cambio`,
      params,
      header
    );
  }

  logout(): void {
    //this.currentUserSubject.next(null);
    localStorage.clear();
  }

  clearUser(): void {
    // localStorage.clear();
    //this.currentUserSubject.next(null);
  }

  /*
  singup(data: RegistroPostulante): Observable<Boolean> {
    let url = `${Const.API_POSTULANTE}v1/postulante`;
    let params = new RequestGeneric<RegistroPostulante>(data);
    const userName = Const.USERNAME_SEGURIDAD;
    const password = Const.PASSWORD_SEGURIDAD;
    const headerInit = new HttpHeaders({
      Authorization: `Basic ${btoa(
        unescape(encodeURIComponent(userName + ':' + password))
      )}`,
    });

    let paramsToken = {
      "trace": {
        "traceId": null
      },
      "payload": {
        "grantType": "clientCredentials"
      }
    };
    let urlToken = `${Const.API_SEGURIDAD}v1/oauth2/tokens`;
    return this.http
      .post<any>(urlToken, paramsToken, {
        headers: headerInit,
        observe: 'response',
      }).pipe(
        mergeMap(responseToken => {
          const headerRegister = new HttpHeaders({
            Authorization: `Bearer ${responseToken.body.payload.accessToken}`,
          });
          return this.http
            .post<any>(url, params, {
              headers: headerRegister,
              observe: 'response',
            }).pipe(
              map(response => {
                if (response.body.status.success) {
                  return response.body.status.success;
                } else {
                  throw new Error(response.body.status.error.messages[0]);
                }
              })
            );
        })
      );

  }*/

  private generatePublicToken(): Observable<HttpHeaders> {
    const userName = Const.USERNAME_SEGURIDAD;
    const password = Const.PASSWORD_SEGURIDAD;
    const codigo = `${btoa(
      unescape(encodeURIComponent(userName + ':' + password))
    )}`;
    const header = {
      headers: new HttpHeaders().set('Authorization', `Basic ${codigo}`),
    };

    const body = {
      trace: {
        traceId: 'string',
      },
      payload: {
        grantType: 'clientCredentials',
      },
    };
    return this.http
      .post(`${Const.API_SEGURIDAD}v1/oauth2/tokens`, body, header)
      .pipe(
        map((response: any) => {
          return new HttpHeaders({
            Authorization: `Bearer ${response.payload.accessToken}`,
          });
        })
      );
  }

}
