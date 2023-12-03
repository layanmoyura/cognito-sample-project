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
  activeUser:any;

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
      this.accesstoken=user.getSignInUserSession().getAccessToken().getJwtToken();
      this.idtoken=user.getSignInUserSession().getIdToken().getJwtToken();
      //debugger;
      this.refreshToken=user.getSignInUserSession().getRefreshToken().getToken();
      this.setToken();
      this.authenticatedSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('idtoken');
      localStorage.removeItem('refreshtoken');
      localStorage.removeItem('activeUser');
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

  

  setToken(): void {
   
    localStorage.setItem('token', this.accesstoken);
    localStorage.setItem('idToken', this.idtoken);
    localStorage.setItem('refreshtoken', this.refreshToken);
    //this.tokenData = jwtDecode(this.idtoken);
   
    
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

  
 
 
  getNewJwtToken() {
    const jobDetailStr:any = localStorage.getItem("activeUser");
    this.activeUser =JSON.parse(jobDetailStr);
    if (!this.activeUser) {
      return null;
    }
 
    const signInUserSession = this.activeUser.signInUserSession;
    const idToken = signInUserSession ? signInUserSession.accessToken : null;
    //debugger;
    console.log((idToken.payload.exp*1000)-300);
    if ((!idToken) || ((idToken.payload.exp * 1000)-300 < 1701591263701)) {
      if (signInUserSession) {
        debugger;
        Auth.Credentials.getCredSource().refreshSession();
        const refreshToken = signInUserSession.refreshToken.token;
        return new Promise((resolve) => {
          this.activeUser.refreshSession(refreshToken, (err:any, session:any) => {
            if (err) {
              resolve(this.signOut());
            }
            this.activeUser.setSignInUserSession(session);
            resolve(session.getIdToken().getJwtToken());
          })
        });
      }
      return Promise.resolve(idToken.getJwtToken());
    }
 
    return Promise.resolve(idToken.getJwtToken());
  }

  
}


