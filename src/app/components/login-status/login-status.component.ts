import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit{
  
  isAuthenticated: boolean = false;
  userFullName: string = '';
  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  ngOnInit() : void {
    this.oktaAuthService.authState$.subscribe(result=>{
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    })
  }
  getUserDetails() {
    if(this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (result)=>{
          this.userFullName = result.name as string;
          const theEmail = result.email;
          this.storage.setItem('userEmail',JSON.stringify(theEmail));
        }
      )
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }

}
