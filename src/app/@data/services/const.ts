import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Const {
  public static API_FILE_SERVER: string;
  public static API_SEGURIDAD: string;
  public static USERNAME_SEGURIDAD: string;
  public static PASSWORD_SEGURIDAD: string;
  public static APPLICATION_ID: number;
  public static DIRECTIVOPUBLICO: string;
  public static ACCEPT_COOKIE: string;



  constructor(private http: HttpClient) {
    Const.ACCEPT_COOKIE = 'ACCEPT_COOKIE';
  }

  public loadCommonConfig() {
    return this.http
      .get('./assets/config/common.config.json')
      .toPromise()
      .then((config: any) => {
        Const.API_FILE_SERVER = config.public_base_url_file_server;
        Const.API_SEGURIDAD = config.public_base_url_seguridad;
      })
      .catch((err: any) => {
        console.error(err);
      });
  }


  public loadElectraConfig() {
    return this.http
      .get('./assets/config/electra-web.config.json')
      .toPromise()
      .then((config: any) => {
        Const.USERNAME_SEGURIDAD = config.client_id;
        Const.PASSWORD_SEGURIDAD = config.client_secret;
        Const.APPLICATION_ID = config.aplicacion_id;

      })
      .catch((err: any) => {
        console.error(err);
      });
  }
}

