import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify,Auth} from 'aws-amplify';

import { environment } from '../environment/environment';

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

  constructor() {
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
    return Auth.confirmSignUp(user.name, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn({
      username: user.email,
      password: user.password
    }).then((response) => {
      console.log(response)
      this.cognitoUser=response;
      
    });
  }

  public handleSignInConfirmation(otpCode: string) {
    return Auth.confirmSignIn(this.cognitoUser, otpCode , "SMS_MFA")
        .then((response)=>{
            console.log(response);
            this.authenticatedSubject.next(true);
        })
        .catch((error) => {
            console.error("Error during sign-in confirmation:", error);
            // Optionally, handle the error or re-throw it
            // Example: this.handleError(error);
        });
  }


  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
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

 

}

