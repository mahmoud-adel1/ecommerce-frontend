import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  private productUrl = environment.luv2shopApiUrl + '/products';
  private productCategoryUrl = environment.luv2shopApiUrl + '/product-category';

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${theCategoryId}`
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response=>response._embedded.products)
    )
  }

  getProductListPaginate(theCategoryId: number,
                         thePageNumber: number,
                         thePageSize: number) : Observable<GetResponseProducts>{
                          const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${theCategoryId}`+
                                            `&page=${thePageNumber}&size=${thePageSize}`;

                          console.log(`Getting products from ${searchUrl}`);
                          return this.httpClient.get<GetResponseProducts>(searchUrl);

                         }

  getProduct(theProductId: number): Observable<Product> {
    const searchUrl = `${this.productUrl}/${theProductId}`;
    return this.httpClient.get<Product>(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.productUrl}/search/findByNameContainingIgnoreCase?name=${keyword}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response=>response._embedded.products)
    );
  }

  searchProductsPaginate(theKeyword: string,
                         thePageNumber: number,
                         thePageSize: number): Observable<GetResponseProducts> {
    const searchUrl = `${this.productUrl}/search/findByNameContainingIgnoreCase?name=${theKeyword}`
                     +`&page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategoriesList(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.productCategoryUrl).pipe(
      map(response=>response._embedded.productCategory)
    )
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

