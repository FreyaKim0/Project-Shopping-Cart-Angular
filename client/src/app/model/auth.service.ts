
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDataSource } from './rest.datasource';
import { User } from './user.model';

@Injectable()
export class AuthService
{
  user: User;

  constructor(private datasource: RestDataSource)
  {
   this.user = new User();
  }

  authenticate(user: User): Observable<any>
  {
     return this.datasource.authenticate(user);
  }

  storeUserData(token: any, user: User): void
  {
    this.datasource.storeUserData(token, user);
  }

  get authenticated(): boolean
  {
   return this.datasource.loggedIn();
  }

  logout(): Observable<any>
  {
    return this.datasource.logout();
  }

  // tslint:disable-next-line: typedef
  createUser()
  {
    console.log('IN auth.service.ts creat() ...');
    return this.datasource.createUser(this.user);
  }
}
