import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  theCartItems: CartItem[] = [];
  theTotalPrice: Subject<number> = new Subject<number>();
  theTotalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    
    if (this.theCartItems.length > 0) {
      
      existingCartItem = this.theCartItems.find(tempCartItem=>tempCartItem.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);

    }

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.theCartItems.push(theCartItem);
    }

    this.computeCartTotals();

  }

  incrementQuantity(theCartItem: CartItem) {
    this.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity == 0) {
      this.removeCartItem(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  removeCartItem(theCartItem: CartItem) {
    let theCartItemIndex: number = this.theCartItems.findIndex(tempCartItem=>theCartItem.id === tempCartItem.id);
    if(theCartItemIndex > -1) {
      this.theCartItems.splice(theCartItemIndex,1);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;
    for (let tempCartItem of this.theCartItems) {
      totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue += tempCartItem.quantity;
    }
    this.theTotalPrice.next(totalPriceValue);
    this.theTotalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.theCartItems) {
      let subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name=${tempCartItem.name}, unitPrice=${tempCartItem.unitPrice}, quantity=${tempCartItem.quantity}, ` + 
                  `subTotalPrice=${subTotalPrice}`
      );
    }
    console.log(`totalPrice=${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log('-------');
  }

}


