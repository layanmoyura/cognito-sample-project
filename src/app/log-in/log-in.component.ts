import { Component } from '@angular/core';
import { CognitoService,IUser } from '../cognito.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  user:IUser;

  constructor(private router:Router, private cognitoService:CognitoService){
    this.user = {} as IUser
  }

  public onSignIn(): void{
    this.cognitoService.signIn(this.user).then(()=>{
      this.router.navigate(['/home']);
    }).catch(()=>{
      console.log("log in error");
    })
  }
}
