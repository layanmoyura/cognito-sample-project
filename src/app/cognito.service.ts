import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify,Auth} from 'aws-amplify';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

export interface IUser {
  email: string;
  password: string;
  code: string;
  name: string;
  phone_number:string;
}


@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  cognitoUser:any
  private authenticatedSubject:BehaviorSubject<any>;

  constructor(private router:Router) {
    Amplify.configure({
     Auth:environment.cognito
    });
    this.authenticatedSubject = new BehaviorSubject<boolean>(false);
  }

  public async signUp(user: IUser): Promise<any> {
    try {
  
      return await Auth.signUp({
        username: user.name,
        password: user.password,
        attributes: { email: user.email, phone_number: user.phone_number }
      });
    } catch (error) {
      console.error("Error during sign-up:", error);
      throw error;
    }
  }
  
  

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.name, user.code)
        .then(() => {
          
        })
        .catch((error) => {
            
            console.error("Error confirming sign-up:", error);
            throw error; // Re-throw the error to propagate it further if needed
        });
  }


 public signIn(user: IUser): Promise<any> {
  return Auth.signIn({
    username: user.email,
    password: user.password
  }).then((response) => {
    console.log(response)
    this.cognitoUser=response;
    this.handleSignInNextSteps();
    
  }).catch((error) => {
    console.error("Error occurred during sign-in:", error);
    // Handle the error here, for example:
    // Display an error message to the user
    // Or perform any other necessary action
    throw error; // Re-throwing the error to propagate it further if needed
  });
    
}


public async handleSignInNextSteps() {
  switch (this.cognitoUser.challengeName) {
    // ...
    case 'NOMFA':
      this.router.navigate(['/home']);
      break;

    case 'SOFTWARE_TOKEN_MFA':
      this.router.navigate(['/otp'])
    break;
    // ...
  }
}



  public handleSignInConfirmation(otpCode: string): Promise<any> {
    return Auth.confirmSignIn(this.cognitoUser, otpCode,'SOFTWARE_TOKEN_MFA')
        .then((response) => {
            console.log(response);
            this.authenticatedSubject.next(true);
            this.router.navigate(['/home']);
        })
        .catch((error) => {
            console.error("Error during sign-in confirmation:", error);
            throw error; // Propagate the error to the caller
        });
  } 

 


  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.cognitoUser=null;
      this.authenticatedSubject.next(false);
    });
  }

  public getUser():Promise<any>{
    return Auth.currentUserInfo();
  }


  public isAuthenticated():Promise<boolean>{
    if(this.authenticatedSubject.value){
      return Promise.resolve(true);
    }
    else{
      return this.getUser().then((user:any)=>{
        if(user){
          return true;
        }
        else{
          return false;
        }
      }).catch(()=> {
        return false;
      })
    }
  }

  async handleUpdateMFAPreference(user:any):Promise<any> {
    try {
      await Auth.setPreferredMFA(user,"TOTP");
    } catch (error) {
      console.log(error);
    }
  }

  async handleTOTPSetup(user:any):Promise<string|null> {
    try {
      const totpSetupDetails = await Auth.setupTOTP(user);
      
      return totpSetupDetails;
      // Open setupUri with an authenticator APP to retrieve an OTP code
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async handleTOTPVerification(user:any,totpCode: string):Promise<any> {
    try {
      await Auth.verifyTotpToken(user,totpCode);
    } catch (error) {
      console.log(error);
    }
  }

  
 

}

