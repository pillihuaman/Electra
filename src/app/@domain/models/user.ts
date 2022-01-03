export class User {

  token?: string;
  id?: string;
  name?: string;
  userName?: string;
  email?: string;
  roles?: Array<string>;
  jwToken?: string;
  refreshToken?: string;
  refreshTokenExpiration?: Date;

}
