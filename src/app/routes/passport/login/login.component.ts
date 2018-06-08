import { Component, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService, MenuService, TitleService } from '@delon/theme';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { environment } from '@env/environment';
import { ACLService } from '@delon/acl';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    /** 表单类型，`0` 表示账密登录，`1` 表示手机登录 */
    type = 0;
    loading = false;

    /* http Post 请求 head类型 */
    httpHead = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private menuService: MenuService,
        private aclService: ACLService,
        private titleService: TitleService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        private http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
        this.form = fb.group({
            account: [null, [Validators.required]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
    }

    // region: fields

    get account() { return this.form.controls.account; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            this.account.markAsDirty();
            this.password.markAsDirty();
            if (this.account.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.captcha.markAsDirty();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;
        this.http.post('http://localhost:7001/user/login', {
        // this.http.post('/user/login', {
            "account": this.account.value,
            "password": this.password.value
        }, this.httpHead).subscribe((res: any) => {
            if (res) {
                this.loading = false;
                if (!res.success) {
                    this.error = res.message;
                    this.msg.error(res.message);
                    return;
                }
                const params = res.info[0];
                const user: any = {
                    username: params.userName,
                    avatar: './assets/img/zorro.svg',
                    token: '123456789',
                    userId: params.userId,
                    class: params.class,
                    address: params.address,
                    mobile: params.mobile,
                    account: params.account,
                };
                this.settingsService.setUser(user);
                localStorage.setItem('customer_user_info_qw', JSON.stringify(user));

                const httpHead = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
                // this.httpClient.get('/profile')
                // this.httpClient.post('http://localhost:7001/menu', this.settingService.user.class, httpHead)
                this.http.get('assets/app-data.json')
                    .subscribe((res: any) => {
                        // 应用信息：包括站点名、描述、年份
                        this.settingsService.setApp({
                            'name': '购物商城',
                            'description': '购物商城'
                        });
                        // 用户信息：包括姓名、头像、邮箱地址
                        this.settingsService.setUser(res.user);
                        // ACL：设置权限为全量
                        this.aclService.setFull(true);
                        // 初始化菜单
                        if(this.settingsService.user.class === 'n') {
                            this.menuService.add(res.menu);
                        }else if(this.settingsService.user.class === 'y') {
                            this.menuService.add(res.admin);
                        }
                        
                        // 设置页面标题的后缀
                        this.titleService.suffix = '购物商城';

                    }, (err: HttpErrorResponse) => {
                    });
                this.router.navigate(['/index']);
            }
        });
    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
