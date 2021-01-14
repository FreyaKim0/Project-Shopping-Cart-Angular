import { Cart } from './cart.model';
import { Injectable } from '@angular/core';

@Injectable()
export class Order
{
  // tslint:disable-next-line: variable-name
  public _id: number;
  public name: string;
  public address: string;
  public city: string;
  public province: string;
  public postalCode: string;
  public country: string;
  public shipped = false;

  constructor(public cart: Cart){}
  clear(): void
  {
    this._id = null;
    this.name = null;
    this.address = null;
    this.city = null;
    this.province = null;
    this.country = null;
    this.shipped = null;
    this.cart.clear();
  }
}