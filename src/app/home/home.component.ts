import { Component } from '@angular/core';
import { CognitoService } from '../cognito.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private cognitoService:CognitoService){}
  async ngOnInit(): Promise<void> {
    //this.cognitoService.getNewJwtToken();
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();
      cognitoUser.refreshSession(currentSession.getRefreshToken(), (err: any, session: { idToken: any; refreshToken: any; accessToken: any; }) => {
        console.log('session', err, session);
        const { idToken, refreshToken, accessToken } = session;
        // do whatever you want to do now :)
      });
    } catch (e) {
      console.log('Unable to refresh Token', e);
    }
  }

}
