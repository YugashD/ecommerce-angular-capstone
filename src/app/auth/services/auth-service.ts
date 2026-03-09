import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /** Endpoint used to authenticate a user and receive an access token. */
  AUTH_URL = 'https://fakestoreapi.com/auth/login';

  /** Endpoint used to create a new user account. */
  SIGNUP_URL = 'https://fakestoreapi.com/users';

  constructor(private http: HttpClient) { }

  // get the login credentials from the login form and send it to rest api
  login(credentials: any) {
    console.log(credentials);
    return this.http.post(this.AUTH_URL, credentials);
  }

  // Registers a new user account with the provided profile data.
  signup(data: any) {
    return this.http.post(this.SIGNUP_URL, data);
  }
}
