import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit{

  theTotalPrice: number = 0.0;
  theTotalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.theTotalPrice.subscribe(data=>this.theTotalPrice = data);
    this.cartService.theTotalQuantity.subscribe(data=>this.theTotalQuantity = data);
  }

}
