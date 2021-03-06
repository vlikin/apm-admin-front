import {AppService, IPermission, IRole, IUser, LOCAL_STORAGE_TOKEN_KEY, LoginHttpAnswer} from './app';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import * as faker from 'faker';
import {delay, mapTo} from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class FakeAppService extends AppService {
  private t_delayPeriod = 2000;

  private t_users = [
    {
      login: 'admin',
      password: 'passwd',
      token: 'token-1234567'
    }
  ];

  public t_storage: {
    permissions: IPermission[],
    roles: IRole[],
    users: IUser[]
  };

  constructor(
    httpClient: HttpClient
  ) {
    super(httpClient);
    this.t_storage = this.t_generateStorage();
    console.log(this.t_storage);
  }

  public t_generateStorage() {
    const permissions = this.t_generatePermissions();
    const roles = this.t_generateRoles(permissions);
    const users = this.t_generateUsers(roles, 23);

    return {
      permissions,
      roles,
      users
    };
  }

  public t_generateRoles(permissions: IPermission[]): IRole[] {
    return [
      'BaseChord Support',
      'BaseChord Manager',
      'Aaron`s Store Manager',
      'Aaron`s IT',
      'Aaron`s Auditing Dept.'
    ].map((name) => {
      return {
        id: faker.random.uuid(),
        name,
        description: faker.lorem.lines(3),
        permissionIds: _.map(permissions, 'id').filter((e) => faker.random.boolean())
      } as IRole;
    });
  }

  public t_generatePermissions() {
    return [
      ['Review deployment groups', 'review_deplyment_groups'],
      ['Review report', 'review_report'],
      ['Review store', 'review_store'],
      ['Review assigned store', 'review_assigned_store'],
      ['Review refresh station', 'review_refresh_station'],
      ['Review refresh session', 'review_refresh_session'],
      ['Review assigned refresh station', 'review_assigned_refresh_station'],
      ['Review audit report', 'review_audit_report'],
      ['Manage refresh station', 'manage_refresh_station'],
      ['Manage deployment groups', 'manage_deplyment_groups'],
    ].map((i) => {
      return {
        id: faker.random.uuid(),
        name: i[0],
        description: `It has a system key ${i[1]}.`
      } as IPermission;
    });
  }

  public t_generateUsers(roles: IRole[], count: number = 10): IUser[] {
    return _.range(count).map((index) => {
      const name = faker.name.firstName();

      return {
        id: faker.random.uuid(),
        name,
        email: faker.internet.email(name),
        roleIds: _.map(roles, 'id').filter((e) => faker.random.boolean())
      } as IUser;
    });
  }

  public t_setDelay(_delay: number) {
    this.t_delayPeriod = _delay;
  }

  public t_delay<T>(o: Observable<T>): Observable<T> {
    if (!!this.t_delayPeriod) {
      return o.pipe(delay(this.t_delayPeriod));
    }

    return o;
  }

  protected loginHttp(login: string, password: string): Observable<LoginHttpAnswer> {
    const user = _.find(this.t_users, (u) => u.login === login);

    if (!!user && user.password === password) {
      return this.t_delay(of({
        token: 'token-1234567'
      }));
    }

    return this.t_delay(of({}));
  }

  public getUserItemHttp(id: string): Observable<IUser> {
    _.find(this.t_storage.users, (u) => {
      return u.id === id;
    });
    return of(null);
  }

  public getUserIndexHttp(): Observable<IUser[]> {
    return of(this.t_storage.users);
  }

  public getPermissionIndexHttp(): Observable<IPermission[]> {
    return of(this.t_storage.permissions);
  }

  public getRoleIndexHttp(): Observable<IRole[]> {
    return of(this.t_storage.roles);
  }

}

