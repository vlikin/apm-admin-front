import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';

export const LOCAL_STORAGE_TOKEN_KEY = 'token';

export interface LoginHttpAnswer {
  token?: string;
}

@Injectable()
export class AppService {
  private authenticationS = new BehaviorSubject<boolean>(false);
  private authenticationO = this.authenticationS.asObservable();
  private token: string = null;

  constructor(
    private httpClient: HttpClient
  ) {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!!token) {
      this.setToken(token);
    }
  }

  public setToken(token) {
    this.token = token;
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    console.log('emit', token);
    this.authenticationS.next(this.isAuthenticated());
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public getAuthenticationO(): Observable<boolean> {
    return this.authenticationO;
  }

  public login(login: string, password: string): Observable<boolean> {
    return this.loginHttp(login, password)
      .pipe(
        tap(({token}) => {
          if (!!token) {
            this.setToken(token);
          }
        }),
        map(({token}) => this.isAuthenticated())
      );

    return of(true);
  }

  public logout() {
    this.setToken(null);
  }

  public clearAll() {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  protected loginHttp(login: string, password: string): Observable<LoginHttpAnswer> {
    return this.httpClient.post<{ token: string }>('/server/get-token', {
      login,
      password
    });
  }
}
