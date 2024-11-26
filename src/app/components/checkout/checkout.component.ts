import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormGroupDirective, FormGroupName, ReactiveFormsModule } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Event } from '@angular/router';

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
              private luv2ShopFormService: Luv2ShopFormService) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
    })



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

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log('The email address is: ' + this.checkoutFormGroup.get('customer')?.value.email);

    console.log('the shipping address country is: ' + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log('the shipping address state is: ' + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

  }
  

}
