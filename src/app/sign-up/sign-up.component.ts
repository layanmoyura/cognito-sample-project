import { Component } from '@angular/core';
import { CognitoService,IUser } from '../cognito.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent {
  
  isConfirm:boolean;
  user:IUser;

  constructor(private router:Router, private cognitoService:CognitoService) {
    this.isConfirm=false;
    this.user = {} as IUser;
  }
 
  public onSignUp(): void {
    this.user.name = this.user.email.split('@')[0];
    this.cognitoService.signUp(this.user).then(()=>{
      this.isConfirm=true;
    }).catch(()=>{
      console.log("error when signup")
      
    })
  }

  public confirmSignUp(): void {
    console.log(this.user)
    this.cognitoService.confirmSignUp(this.user).then(()=>{
      this.router.navigate(['/login']);
    }).catch(()=>{
      console.log("error when confirm signup")
      this.isConfirm=false
    })
  }
}
