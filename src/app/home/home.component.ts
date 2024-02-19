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
      const token_exp = currentSession.getIdToken().getExpiration();
      //console.log(token_exp*1000)
      //console.log(Date.now())
      //(token_exp* 1000)- 300 < Date.now()
      if (true){
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (err: any, session: { idToken: any; refreshToken: any; accessToken: any; }) => {
          console.log('session', err, session);
          const { idToken, refreshToken, accessToken } = session;
          // do whatever you want to do now :)
        });
      }
      
    } catch (e) {
      console.log('Unable to refresh Token', e);
    }
  }

}
