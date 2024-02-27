import { Component } from '@angular/core';
import { CognitoService, IUser } from '../cognito.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user: IUser;
  cognitoUser: any;
  totpUri: any;
  isConfirm: boolean = false;
  currentMFA: any;

  constructor(private cognitoService: CognitoService) {
    this.user = {} as IUser;
  }

  async ngOnInit(): Promise<void> {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      this.currentMFA = await this.cognitoService.getCurrentMFA(cognitoUser);
      const currentSession = await Auth.currentSession();
      const token_exp = currentSession.getIdToken().getExpiration();

      if ((token_exp * 1000) - 300 < Date.now()) {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (err: any, session: { idToken: any; refreshToken: any; accessToken: any; }) => {
          console.log('session', err, session);
          const { idToken, refreshToken, accessToken } = session;
          // do whatever you want to do now :)
        });
      }
    } catch (e) {
      console.error('Unable to refresh Token', e);
      alert('Error: Unable to refresh Token');
    }
  }

  async enableMFA() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const email = cognitoUser.attributes['email'];
      const qrCodeData = await this.cognitoService.handleTOTPSetup(cognitoUser);
      this.totpUri = "otpauth://totp/MFA:" + email + "?secret=" + qrCodeData + "&issuer=CognitoJSPOC";
      console.log(this.totpUri);
    } catch (e) {
      console.error('Error enabling MFA', e);
      alert('Error: Unable to enable MFA');
    }
  }

  continueMFA() {
    this.isConfirm = true;
  }

  async disableMFA() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await this.cognitoService.disableMFAPreference(cognitoUser);
    } catch (e) {
      console.error('Error disabling MFA', e);
      alert('Error: Unable to disable MFA');
    }
  }

  async confirmMFA() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await this.cognitoService.handleTOTPVerification(cognitoUser, this.user.code);
      await this.cognitoService.handleUpdateMFAPreference(cognitoUser);
    } catch (e) {
      console.error('Error confirming MFA', e);
      alert('Error: Unable to confirm MFA');
    }
  }
}
