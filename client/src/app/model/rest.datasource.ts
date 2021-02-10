import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book.model';
import { Order } from './order.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user.model';

const PROTOCOL = 'https';
const PORT = 3500;

@Injectable()
export class RestDataSource
{
  user: User;
  baseUrl: string;
  authToken: string;

  private httpOptions =
  {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };

  constructor(private http: HttpClient,
              private jwtService: JwtHelperService)
  {
    this.user = new User();
    // this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/api/`;
    this.baseUrl = `https://xu-tung-jin-assignment2.herokuapp.com/api/`;
  }





  // loggin, authenticate, loggout
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





  // get, add, edit, update user (registration)
  storeUserData(token: any, user: User): void
  {
    localStorage.setItem('id_token', 'Bearer ' + token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getUser(): Observable<User[]>
  {
    // this url?
    return this.http.get<User[]>(this.baseUrl + 'admin/register');
  }

  getUserbyId( id: string): Observable<User[]>
  {
    // this url?
    return this.http.get<User[]>(this.baseUrl + 'admin/register');
  }

  addUser(user: User): Observable<User>
  {
    // this url?
    this.loadToken();
    return this.http.post<User>(this.baseUrl + 'admin/register', user, this.httpOptions);
  }

  updateUser(user: User): Observable<User>
  {
    // this url?
    this.loadToken();
    return this.http.post<User>(`${this.baseUrl}book-list/edit/${user.username}`, user , this.httpOptions);
  }





  // get, add, update, delete books
  getBooks(): Observable<Book[]>
  {
    return this.http.get<Book[]>(this.baseUrl + 'book-list');
  }

  addBook(book: Book): Observable<Book>
  {
    this.loadToken();
    return this.http.post<Book>(this.baseUrl + 'book-list/add', book, this.httpOptions);
  }

  updateBook(book: Book): Observable<Book>
  {
    this.loadToken();
    return this.http.post<Book>(`${this.baseUrl}book-list/edit/${book._id}`, book, this.httpOptions);
  }

  deleteBook(id: number): Observable<Book>
  {
    this.loadToken();

    console.log(id);

    return this.http.get<Book>(`${this.baseUrl}book-list/delete/${id}`, this.httpOptions);
  }





  // save, get, delete, update orders
  saveOrder(order: Order): Observable<Order>
  {
    console.log(JSON.stringify(order));
    return this.http.post<Order>(this.baseUrl + 'orders/add', order);
  }

  getOrders(): Observable<Order[]>
  {
    this.loadToken();
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  deleteOrder(id: number): Observable<Order>
  {
    this.loadToken();
    return this.http.get<Order>(`${this.baseUrl}orders/delete/${id}`, this.httpOptions);
  }

  updateOrder(order: Order): Observable<Order>
  {
    this.loadToken();
    return this.http.post<Order>(`${this.baseUrl}orders/edit/${order._id}`, order, this.httpOptions);
  }





  // load Token
  private loadToken(): void
  {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.authToken);
  }


}

