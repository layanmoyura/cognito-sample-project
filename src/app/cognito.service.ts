import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify,Auth} from 'aws-amplify';

import { environment } from '../environment/environment';

export interface IUser {
  email: string;
  password: string;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private authenticatedSubject:BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
     Auth:environment.cognito
    });
    this.authenticatedSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn({
      username: user.email,
      password: user.password
    }).then(() => {
      this.authenticatedSubject.next(true);
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

