import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

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
              private productService: ProductService) {}

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
  

}
