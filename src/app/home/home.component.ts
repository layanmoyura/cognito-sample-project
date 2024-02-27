import { Component } from '@angular/core';
import { CognitoService, IUser } from '../cognito.service';
import { Auth } from 'aws-amplify';
import * as QRCode from 'qrcode'; // Import QRCode as a function

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user:IUser
  cognitoUser:any
  totpUri:any
  isConfirm:boolean=false
  

  constructor(private cognitoService:CognitoService){
    this.user = {} as IUser
  }
  async ngOnInit(): Promise<void> {
    //this.cognitoService.getNewJwtToken();
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();
      const token_exp = currentSession.getIdToken().getExpiration();
    
      //console.log(token_exp*1000)
      //console.log(Date.now())
      //(token_exp* 1000)- 300 < Date.now()
      if ((token_exp* 1000)- 300 < Date.now()){
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


  async enableMFA() {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    console.log(cognitoUser)
    const email = cognitoUser.attributes['email']   //this.cognitoService.handleUpdateMFAPreference(cognitoUser);
    
    const qrCodeData = await this.cognitoService.handleTOTPSetup(cognitoUser)
    this.totpUri = "otpauth://totp/MFA:"+ email+"?secret="+ qrCodeData +"&issuer=CognitoJSPOC";
    console.log(this.totpUri)
  
  }

  continueMFA() {
    this.isConfirm=true
    // Place your continueMFA function logic here
    // Make sure to adjust the function according to Angular's best practices
  }

  disableMFA() {
    // Place your disableMFA function logic here
    // Make sure to adjust the function according to Angular's best practices
  }


  async confirmMFA(){
    const cognitoUser = await Auth.currentAuthenticatedUser();
    this.cognitoService.handleTOTPVerification(cognitoUser,this.user.code)
    this.cognitoService.handleUpdateMFAPreference(cognitoUser)
  }




  


  

}
