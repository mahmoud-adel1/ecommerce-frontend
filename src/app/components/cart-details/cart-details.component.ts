import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [NgFor,CommonModule,RouterLink],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{
  
  cartItems: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number= 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.theCartItems;
    this.cartService.theTotalPrice.subscribe(data=>this.totalPrice = data);
    this.cartService.theTotalQuantity.subscribe(data=>this.totalQuantity = data);
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.incrementQuantity(theCartItem); 
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  removeCartItem(theCartItem: CartItem) {
    this.cartService.removeCartItem(theCartItem);
  }

}
