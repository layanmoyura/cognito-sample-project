import { Component } from '@angular/core';
import { CognitoService, IUser } from '../cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrl: './confirm-otp.component.css'
})
export class ConfirmOtpComponent {

  user:IUser

  constructor(private router:Router, private cognitoService:CognitoService){
    this.user = {} as IUser
  }

  async confirmSignIn(){
    await this.cognitoService.handleSignInConfirmation(this.user.code);
  }

}
