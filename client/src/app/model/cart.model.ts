import { Injectable } from '@angular/core';
import { Book } from './book.model';
@Injectable()
  export class Cart {
  public lines: CartLine[] = [];
  public itemCount = 0;
  public cartPrice = 0;

  constructor(){}

  addLine(book: Book, quantity: number= 1, shipping: boolean): void {
    const line = this.lines.find(l => l.book._id === book._id);

    // If there is no duplicated _id
    if (line !== undefined)
    {
      line.quantity += quantity;
    }
    else
    {
      this.lines.push(new CartLine(book, quantity, shipping));
    }
    this.recalculate();
  }

  updateQuantity(book: Book, quantity: number): void {
    const line = this.lines.find(l => l.book._id === book._id);
    if (line !== undefined)
    {
      line.quantity = Number(quantity);
    }
    this.recalculate();
  }

  removeLine(id: number): void {
    const index = this.lines.findIndex(l => l.book._id === String(id));
    this.lines.splice(index, 1);
    this.recalculate();
  }

  clear(): void {
    this.lines = [];
    this.itemCount = 0;
    this.cartPrice = 0;
  }

  private recalculate(): void {
    this.itemCount = 0;
    this.cartPrice = 0;
    this.lines.forEach(l => {
      this.itemCount += l.quantity;
      this.cartPrice += (l.quantity * l.book.price);
    });
  }
}

// CartLine for recording each books
export class CartLine {
 constructor(public book: Book,
             public quantity: number,
             public shipping: boolean) { }

 get lineTotal(): number {
   return this.quantity * this.book.price;
 }
}