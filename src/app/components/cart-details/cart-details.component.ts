import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { 

  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    // since only changes are recorded, explicitly load the price and quantity on init
    this.totalPrice = this.cartService.getTotalPrice();
    this.totalQuantity = this.cartService.getTotalQuantity();
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data
    });
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data
    });
  }

  incrementItem(cartItem: CartItem){
    this.cartService.addToCart(cartItem);
    this.cartItems = this.cartService.cartItems;
  }

  decrementItem(cartItem: CartItem){
    this.cartService.decrementQuantityFromCart(cartItem);
    this.cartItems = this.cartService.cartItems;
  }

  removeItem(cartItem: CartItem){
    this.cartService.removeItem(cartItem);
    this.cartItems = this.cartService.cartItems;
  }

  clearCart(){
    this.cartService.clearCart();
    this.cartItems = this.cartService.cartItems;
  }

  confirmation(msg: string){
    return confirm(msg);
  }
}
