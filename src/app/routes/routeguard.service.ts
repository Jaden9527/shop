import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SettingsService } from '@delon/theme';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Injectable()
export class RouteguardService implements CanActivate {
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
      // 当前路由名称
      const path = route.routeConfig.path;  
      // nextRoute: 设置需要路由守卫的路由集合
      const nextRoute = ['dashboard'];

      const user = this.tokenService.get();

      // if ( !user.name ) {
      //   this.router.navigateByUrl('/passport/login');
      //   return false;
      // }

      return true;
  }

 

  constructor(private router: Router, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) { }

}
