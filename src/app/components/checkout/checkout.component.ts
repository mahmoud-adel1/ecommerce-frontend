import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormGroupDirective, FormGroupName, ReactiveFormsModule, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Event, Router } from '@angular/router';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../common/order';
import { CartItem } from '../../common/cart-item';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgFor],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9._]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        state: [''],
        country: [''],
        zipCode: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        state: [''],
        country: [''],
        zipCode: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{3}$')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
      
      
    });

    const startMonth: number = new Date().getMonth()+1;
    console.log('Start Month = ' + startMonth);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(data=>{
      console.log('Credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    })

    this.luv2ShopFormService.getCreditCardYears().subscribe(data=>{
      this.creditCardYears = data;
    })

    this.luv2ShopFormService.getCountries().subscribe(data=>{
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
      this.checkoutFormGroup.get('shippingAddress.country')?.setValue(data[0]);
      this.checkoutFormGroup.get('billingAddress.country')?.setValue(data[0]);
      this.getStates('shippingAddress');
      this.getStates('billingAddress');

    })

    this.reviewCartDetails();
  }



  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get nameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get cardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get securityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if(event.target.checked) {
      this.billingAddressStates = this.shippingAddressStates;
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = creditCardFormGroup?.value.expirationYear;
    const currentYear: number = new Date().getFullYear();
    let startMonth: number = 0;
    if(selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(data=>{
      console.log('Retrieved credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    })
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);


    this.luv2ShopFormService.getStates(countryCode).subscribe(data=>{
      if(formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
        console.log('billing address state');
      }
      formGroup?.get('state')?.setValue(data[0]);
    });

    
  }

  reviewCartDetails() {
    this.cartService.theTotalPrice.subscribe(data=>{
      this.totalPrice = data;
    })

    this.cartService.theTotalQuantity.subscribe(data=>{
      this.totalQuantity = data;
    })

  }

  onSubmit() {
    console.log('Handling the submit button');

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log('The email address is: ' + this.checkoutFormGroup.get('customer')?.value.email);

    console.log('the shipping address country is: ' + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log('the shipping address state is: ' + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
    
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const orderItems: OrderItem[] = this.cartService.theCartItems.map(cartItem=>new OrderItem(cartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.get('customer')?.value;

    purchase.shippingAddress = this.checkoutFormGroup.get('shippingAddress')?.value;
    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingAddressCountr: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress!.state=shippingAddressState.name;
    purchase.shippingAddress!.country=shippingAddressCountr.name;

    purchase.billingAddress = this.checkoutFormGroup.get('billingAddress')?.value;
    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingAddressCountr: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress!.state=billingAddressState.name;
    purchase.billingAddress!.country=billingAddressCountr.name;

    purchase.orderItems = orderItems;
    purchase.order = order;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response=>{
        alert(`Your order has been received\norder tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err=>{
        alert(`There was an error: ${err.message}`);
      }
    })

    

  }
  resetCart() {
    this.cartService.theCartItems = [];
    this.cartService.theTotalPrice.next(0);
    this.cartService.theTotalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }
  

}
