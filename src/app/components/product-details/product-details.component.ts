import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

  product: Product = new Product();

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.getProduct();
    })
  }
  getProduct() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe(data=>{
      this.product = data;
    })
  }

  addToCart() {
    console.log(`Adding to the cart: ${this.product.name}, ${this.product.unitPrice}`);
    let cartItem: CartItem = new CartItem(this.product.id!, this.product.name!, this.product.imageUrl!, this.product.unitPrice!);
    this.cartService.addToCart(cartItem);

  }
  

}
