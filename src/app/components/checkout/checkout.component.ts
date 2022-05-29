import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from 'src/app/services/form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [""],
        lastName: [""],
        email: [""]
      }),
      shippingAddress: this.formBuilder.group({
        country: [""],
        street: [""],
        city: [""],
        state: [""],
        zipCode: [""]
      }),
      billingAddress: this.formBuilder.group({
        country: [""],
        street: [""],
        city: [""],
        state: [""],
        zipCode: [""]
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""]
      })
    });

    this.formService.getCreditCardYears().subscribe(data => this.creditCardYears = data);
    this.formService.getCreditCardMonths(new Date().getMonth() + 1).subscribe(data => this.creditCardMonths = data);
    this.formService.getCountries().subscribe(data => this.countries = data);
  }

  onSubmit(){
    
  }

  copyShippingAddressToBillingAddress(event: Event){
    if ((<HTMLInputElement>event.target).checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleYearsAndMonths(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup?.value.expirationYear);
    let month = 1;
    if (selectedYear === currentYear){
      month = new Date().getMonth() + 1;
    }
    this.formService.getCreditCardMonths(month).subscribe(data => this.creditCardMonths = data);
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.controls[formGroupName];
    const code = formGroup.value.country.code;
    const name = formGroup.value.country.name;

    console.log("Code - " + code);
    this.formService.getStates(code).subscribe(data => {
      if (formGroupName === "shippingAddress")
        this.shippingAddressStates = data;
      else
        this.billingAddressStates = data;
      if (data.length > 0)
        formGroup.get('state')?.setValue(data[0]);
    })
  }
}
