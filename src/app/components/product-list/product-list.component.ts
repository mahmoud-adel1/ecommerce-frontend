import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor,CommonModule, RouterLink, NgbModule],
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  previousKeyword: string = '';
  currentCategoryName: string = '';
  
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  
  searchMode: boolean = false;



  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( ()=>{
      this.listProducts();
    } )
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if(keyword != this.previousKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.productService.searchProductsPaginate(keyword,
                                               this.pageNumber-1,
                                               this.pageSize).subscribe(data=>{
                                                this.products = data._embedded.products;
                                                this.pageNumber = data.page.number+1;
                                                this.pageSize = data.page.size;
                                                this.totalElements = data.page.totalElements;
                                               })
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      this.currentCategoryName = this.currentCategoryName.replace('_',' ');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);
    
    this.productService.getProductListPaginate(this.currentCategoryId,
                                               this.pageNumber-1,
                                               this.pageSize).subscribe(
                                                data=>{
                                                  this.products = data._embedded.products;
                                                  this.pageNumber = data.page.number+1;
                                                  this.pageSize = data.page.size;
                                                  this.totalElements = data.page.totalElements;
                                                }
                                              )
  }


  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    let cartItem: CartItem = new CartItem(theProduct.id!,theProduct.name!, theProduct.imageUrl!, theProduct.unitPrice!);
    this.cartService.addToCart(cartItem);
  }

  
  

}
