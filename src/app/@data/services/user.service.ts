import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/@domain/models/user";
import { UserRepository } from "src/app/@domain/repository/user.repository";
import { ApiService } from "./api.service";
import { Const } from "./const";


@Injectable({
  providedIn: 'root',
})

export class UserService extends UserRepository {

  constructor(private http: HttpClient, private apiService: ApiService) {
    super();
  }
    getusers(): Observable<User[]>
  {
   const url = `${Const.API_SEGURIDAD}/Account/get-users`;
      return this.apiService.post(url,{});
  }

}
