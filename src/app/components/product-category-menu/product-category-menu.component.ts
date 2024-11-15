import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit{

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategoriesList().subscribe(data=>{
      this.productCategories = data;
    })
  }

  encodeURL(categoryId: number, categoryName: string) {
    categoryName = categoryName.replace(' ','_');
    const url = `/category/${categoryId}/${categoryName}`;
    this.router.navigateByUrl(url);
  }

}
