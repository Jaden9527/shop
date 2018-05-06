import { Router } from '@angular/router';
import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private httpClient: HttpClient,
        private injector: Injector) { 
            this.tokenService.set({
                token: 'f93936f5-ee07-4f65-bef3-61a37249ab47'
            });
        }
        class = null;
    private viaHttp(resolve: any, reject: any) {
        this.class = this.settingService.user.class;
        if (!this.class) {
            this.injector.get(Router).navigateByUrl('/');
            resolve({});
            return;
        }
        const httpHead = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
            // this.httpClient.get('/profile')
        // this.httpClient.post('http://localhost:7001/menu', this.settingService.user.class, httpHead)
        this.httpClient.get('assets/app-data.json')
            .subscribe((res: any) => {
                // 应用信息：包括站点名、描述、年份
                this.settingService.setApp({
                    'name': '购物商城',
                    'description': '购物商城'
                });
                // 用户信息：包括姓名、头像、邮箱地址
                this.settingService.setUser(res.user);
                // ACL：设置权限为全量
                this.aclService.setFull(true);
                // 初始化菜单
                this.menuService.add(res.menu);
                // 设置页面标题的后缀
                this.titleService.suffix = '购物商城';

                resolve(res);
            }, (err: HttpErrorResponse) => {
                resolve(null);
            });
    }

    private viaMock(resolve: any, reject: any) {
        // const tokenData = this.tokenService.get();
        // if (!tokenData.token) {
        //     this.injector.get(Router).navigateByUrl('/passport/login');
        //     resolve({});
        //     return;
        // }
        // mock
        const app: any = {
            name: `购物商城`,
            description: `购物商城`
        };
        const user: any = {
            name: 'Admin',
            avatar: './assets/img/zorro.svg',
            email: 'cipchk@qq.com',
            token: '123456789'
        };
        // 应用信息：包括站点名、描述、年份
        this.settingService.setApp(app);
        // 用户信息：包括姓名、头像、邮箱地址
        // this.settingService.setUser(user);
        // ACL：设置权限为全量
        this.aclService.setFull(false);
        // 初始化菜单
        this.menuService.add([
            {
                text: '主导航',
                group: true,
                children: [
                    {
                        text: '仪表盘',
                        link: '/dashboard',
                        icon: 'icon-speedometer'
                    },
                    {
                        text: '快捷菜单',
                        icon: 'icon-rocket',
                        shortcut_root: true
                    }
                ]
            }
        ]);
        // 设置页面标题的后缀
        this.titleService.suffix = app.name;

        resolve({});
    }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            // http
            this.viaHttp(resolve, reject);
            // mock
            // this.viaMock(resolve, reject);
        });
    }
}
