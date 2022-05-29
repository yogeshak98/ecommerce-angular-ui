import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  private totalPriceOfCart: number = 0;
  private totalQuantityInCart: number = 0;

  constructor() { }

  addToCart(newCartItem: CartItem){
    let existingCartItem: boolean = false;

    // update existing cartQuantity
    for (let cartItem of this.cartItems){
      if (cartItem.id === newCartItem.id){
        cartItem.quantity++;
        existingCartItem = true;
        break;
      }
    }

    if (!existingCartItem)
      this.cartItems.push(newCartItem);

    this.totalQuantityInCart++;
    this.totalPriceOfCart += newCartItem.unitPrice;
    this.emitCartChangeEvent();
  }

  decrementQuantityFromCart(newCartItem: CartItem) {
    newCartItem.quantity--;
    this.totalQuantityInCart--;
    this.totalPriceOfCart -= newCartItem.unitPrice;
    if (newCartItem.quantity == 0)
      this.removeItem(newCartItem);
    this.emitCartChangeEvent();
  }

  removeItem(newCartItem: CartItem){
    if (newCartItem.quantity > 0){
      this.totalQuantityInCart -= newCartItem.quantity;
      this.totalPriceOfCart -= newCartItem.quantity * newCartItem.unitPrice;
      newCartItem.quantity = 0;
    }
    this.cartItems = this.cartItems.filter(cartItem => cartItem.quantity > 0);
    this.emitCartChangeEvent();
  }

  clearCart() {
    this.cartItems = [];
  }

  emitCartChangeEvent() {
    this.totalPrice.next(this.totalPriceOfCart);
    this.totalQuantity.next(this.totalQuantityInCart);
  }

  getTotalPrice(){
    return this.totalPriceOfCart;
  }

  getTotalQuantity(){
    return this.totalQuantityInCart;
  }
}
