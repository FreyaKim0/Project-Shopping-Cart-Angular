/* Online Middleware To Backend */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders , HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book.model';
import { Order } from './order.model';
import { JwtHelperService, JwtInterceptor } from '@auth0/angular-jwt';
import { User } from './user.model';
import { map } from 'rxjs/operators';
import { Cart } from './cart.model';
import { Type } from '@angular/compiler/src/core';
import { faShoePrints } from '@fortawesome/free-solid-svg-icons';

const PROTOCOL = 'https';
const PORT = 3500;

@Injectable()
export class RestDataSource
{
  // Who is logging as user in this browser...
  user: User;  // username , displayname and email
  authToken: string;
  baseUrl: string;

 private httpOptions =
  {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-control-Allow-Headers': 'Origin, X-Requested-With,Content-Type, Accept',
    })
  };

  constructor(private http: HttpClient,
              private jwtService: JwtHelperService)
  {
    this.user = new User();
    // this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/api/`;
    this.baseUrl = `https://xu-tung-jin-assignment2.herokuapp.com/api/`;
  }





  // get, add, update user (registration)
  getUser(): Observable<User[]>
  {
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  addUser(user: User): Observable<User>
  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'this.authToken',
      }
    );
    this.loadToken();
    // tslint:disable-next-line: object-literal-shorthand
    return this.http.post<User>(this.baseUrl + 'register', user, { headers: headers }).pipe(map(res => res));
  }

  updateUser(user: User): Observable<User>
  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'this.authToken',
      }
    );
    this.loadToken();
     // tslint:disable-next-line: object-literal-shorthand
    return this.http.post<User>(this.baseUrl + 'register',  { headers: headers }).pipe(map(res => res));
  }








  // loggin (storeUserData + authenticate) , loggout
  storeUserData(token: any, user: User): void
  {
    localStorage.setItem('id_token', 'bearer ' + token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;

    console.log('rest.datasource:');
    console.log('authToken:' + this.authToken);
    console.log('user displayname:' + this.user.displayName);
    console.log('user email:' + this.user.email);
    console.log('user username:' + this.user.username);
  }

  authenticate(user: User): Observable<any>
  {
    return this.http.post<any>(this.baseUrl + 'login', user, this.httpOptions);
  }

  logout(): Observable<any>
  {
    this.authToken = null;
    this.user = null;
    localStorage.clear();

    return this.http.get<any>(this.baseUrl + 'logout', this.httpOptions);
  }

  loggedIn(): boolean
  {
    return !this.jwtService.isTokenExpired(this.authToken);
  }









  // get, add, update, delete books
  getBooks(): Observable<Book[]>
  {
    return this.http.get<Book[]>(this.baseUrl + 'book-list');
  }

  addBook(book: Book): Observable<any>
  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'this.authToken',
      }
    );
    this.loadToken();
    // tslint:disable-next-line: object-literal-shorthand
    return this.http.post<Book>(this.baseUrl + 'book-list/add', book, {headers: headers}).pipe(map(res => res));
  }


  updateBook(book: Book): Observable<Book>
  {   const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'this.authToken',
    }
    );
      this.loadToken();
      console.log('rest.datasources,update book id:' + book._id);
      console.log('rest.datasources,update book name:' + book.name);
      console.log('rest.datasources,update book author:' + book.author);
      console.log('rest.datasources,update book description:' + book.description);
      console.log('rest.datasources,update book price:' + book.price);
      console.log('rest.datasources,update book published:' + book.published);
      return this.http.post<Book>(`${this.baseUrl}book-list/edit/${book._id}`, book, {headers: headers}).pipe(map(res => res));
  }

  deleteBook(id: number): Observable<Book>
  {   const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'this.authToken',
    }
  );
      this.loadToken();
      return this.http.get<Book>(`${this.baseUrl}book-list/delete/${id}`, {headers: headers}).pipe(map(res => res));
  }





  // save, get, delete, update orders
  saveOrder(order: Order): Observable<Order>
  {
    console.log(JSON.stringify(order));
    return this.http.post<Order>(this.baseUrl + 'orders/add', order);
  }

  getOrders(): Observable<Order[]>
  {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  deleteOrder(id: number): Observable<Order>
  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'this.authToken',
      }
    );
    this.loadToken();
    return this.http.get<Order>(`${this.baseUrl}orders/delete/${id}`, {headers:headers}).pipe(map(res => res));
  }

  updateOrder(order: Order): Observable<Order>
  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'this.authToken',
      }
    );
    this.loadToken();
    return this.http.post<Order>(`${this.baseUrl}orders/edit/${order._id}`, order, {headers: headers}).pipe(map(res => res));
  }





  // load Token
  // the token be sent back to server side
  // each time when requiring some personal data from backend
  private loadToken(): void
  {
    const token = localStorage.getItem('id_token');
    this.authToken = token;

    /*const a = this.httpOptions.headers;
    const show = [];

    for (const key in a){
      if (a.hasOwnProperty(key)){
        if (a[key] !== null && a[key].hasOwnProperty(key))
        {
          show.push('key : ' + key + '\n' +
          'vlaue :' + a[key]);
        }
      }
    }
    console.log('loadToken: httpOptions.Httpheader:');
    console.log(' Before load: ' + show.join('\n\n') );*/
    // this may wrong

    // this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.authToken);

    /*const a2 = this.httpOptions.headers;
    const show2 = [];
    for (const key2 in a2){
      if (a2.hasOwnProperty(key2)){
        if (key2 === 'lazyInit')
        {
          // tslint:disable-next-line: forin
          for (const key3 in a2[key2])
          {
            show2.push('Main key : ' + key2 + '\n' +
            'sub key:' + key3 + '\n' +
            'vlaue :' + a2[key2][key3]);
          }
        }
      }
      }*/

  }
}

