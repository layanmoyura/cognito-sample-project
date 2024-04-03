import { Component } from '@angular/core';
import { CognitoService,IUser } from '../cognito.service';
import { Router } from '@angular/router';
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
  
  

  constructor(private router:Router, private cognitoService:CognitoService, private socialAuthService: SocialAuthService) {
    this.user = {} as IUser

    this.socialAuthService.authState.subscribe((socialUser: SocialUser) => {
      console.log(socialUser)

      if(socialUser){
        
        this.user.name = socialUser.email.split('@')[0];
        this.user.email = socialUser.email;
        this.user.password = this.cognitoService.generatePasswordFromSub(socialUser.idToken);
        
        this.cognitoService.signIn(this.user).then((response)=>{

          console.log(response);
          this.cognitoUser=response;
          this.router.navigate(['/home']);

        }).catch((err)=>{
          
          if(err.code == 'NotAuthorizedException'){
            this.router.navigate(['/signup'], {
              queryParams: { user: JSON.stringify(this.user) }
            });
          }
          
          
        })
      
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

  public signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


  

}
