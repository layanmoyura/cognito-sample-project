import { Component } from '@angular/core';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private cognitoService:CognitoService){}

  public ngOnInit():void{
    this.cognitoService.signOut().then(()=>{
      console.log("logged out")
    })
  }

}
