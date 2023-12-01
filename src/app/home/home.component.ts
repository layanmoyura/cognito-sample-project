import { Component } from '@angular/core';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private cognitoService:CognitoService){}
  ngOnInit(): void {
    this.cognitoService.getNewJwtToken();
  }

}
