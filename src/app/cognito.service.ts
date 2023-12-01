import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify,Auth} from 'aws-amplify';
import {jwtDecode} from 'jwt-decode';
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

  private accesstoken :string="";
  private idtoken :string="";
  private refreshToken :string="";
  private tokenExpireTime :string="";
  tokenData:any;

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
    }).then((user) => {
      localStorage.clear();
      localStorage.setItem("activeUser",JSON.stringify(user));
      this.getSessionToken();
      this.accesstoken=user.getSignInUserSession().getAccessToken().getJwtToken();
      this.idtoken=user.getSignInUserSession().getIdToken().getJwtToken();
      debugger;
      this.refreshToken=user.getSignInUserSession().getRefreshToken().getToken();
      this.setToken();
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

  public getSessionToken() {
    Auth.configure({
      oauth: CognitoService
      })
      Auth.currentAuthenticatedUser()
      .then(user => console.log(user))
      .catch(err => console.log(err))
  }

  setToken(): void {
   
    localStorage.setItem('token', this.accesstoken);
    localStorage.setItem('idtoken', this.idtoken);
    localStorage.setItem('represhtoken', this.refreshToken);
    this.tokenData = jwtDecode(this.idtoken);
    localStorage.setItem("userId",this.tokenData['custom:UserId']);
    localStorage.setItem("tenantId",this.tokenData['custom:TenantId']);
    localStorage.setItem("roleName",this.tokenData['custom:roleName']);
  }

  
}


