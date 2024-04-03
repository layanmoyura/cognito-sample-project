import { Component } from '@angular/core';
import { CognitoService,IUser } from '../cognito.service';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode'; // Import QRCode as a function

import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  user:IUser;
  isConfirm:boolean=false;
  qrCodeData: any;
  cognitoUser:any
  socialUser: SocialUser|null = null;
  

  constructor(private router:Router, private cognitoService:CognitoService, private socialAuthService: SocialAuthService) {
    this.user = {} as IUser

    this.socialAuthService.authState.subscribe((socialUser: SocialUser) => {
      console.log(socialUser);
      this.socialUser = socialUser;
      this.user.email = this.socialUser.email;
      this.user.password = this.socialUser.idToken;
      if(this.socialUser){
        this.cognitoService.signIn(this.user);
      }
    });
  }

  public onSignIn(): void{
    this.cognitoService.signIn(this.user).then((response)=>{
      console.log(response)
      this.cognitoUser=response;
    }).catch(()=>{
      console.log("log in error");
    })
  }

  public confirmSignIn(): void {
    this.cognitoService.handleSignInConfirmation(this.user.code)
        .then(() => {
            this.router.navigate(['/home']);
        })
        .catch(() => {
            console.log("Error during MFA confirmation");
            this.isConfirm=false;
            this.router.navigate(['/login']);
        });
  }

  public generateQRCode(): void {
    const qrContainer = document.getElementById('qrcode');
    QRCode.toCanvas(qrContainer, this.qrCodeData, function (error) {
      if (error) {
        console.error("Error generating QR code:", error);
        // Handle error if needed
      } else {
        console.log('QR Code generated');
      }
    });
  }

  public signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


  

}
