import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from '@delon/theme';

@Component({
    selector: 'passport-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.less' ]
})
export class UserRegisterComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;
    visible = false;
    status = 'pool';
    progress = 0;
    passwordProgressMap = {
        ok: 'success',
        pass: 'normal',
        pool: 'exception'
    };

    
    httpHead = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(fb: FormBuilder, private router: Router, public msg: NzMessageService, private http: HttpClient,
        private settingsService: SettingsService,) {
        this.form = fb.group({
            userName: [null],
            account: [null],
            password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
            confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
            address: [null],
            mobilePrefix: [ '+86' ],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]]
        });
    }

    static checkPassword(control: FormControl) {
        if (!control) return null;
        const self: any = this;
        self.visible = !!control.value;
        if (control.value && control.value.length > 9)
            self.status = 'ok';
        else if (control.value && control.value.length > 5)
            self.status = 'pass';
        else
            self.status = 'pool';

        if (self.visible) self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }

    static passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }

    // region: fields

    get mail() { return this.form.controls.mail; }
    get password() { return this.form.controls.password; }
    get confirm() { return this.form.controls.confirm; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

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
        // this.error = '';
        // for (const i in this.form.controls) {
        //     this.form.controls[i].markAsDirty();
        // }
        // if (this.form.invalid) return;
        // // mock http
        // this.loading = true;
        // setTimeout(() => {
        //     this.loading = false;
        //     this.router.navigate(['/passport/-result']);
        // }, 1000);

        const params = this.form.value;
        params.class = 'n';
        params.mobile = params.mobilePrefix + params.mobile;
        delete params.confirm;
        delete params.mobilePrefix;
        // this.http.post('/user/register',params, this.httpHead).subscribe((res: any) => {
        this.http.post('http://localhost:7001/user/register',params, this.httpHead).subscribe((res: any) => {
            if (res) {
                this.loading = false;
                if (!res.success) {
                    this.error = res.msg;
                    this.msg.error(res.message);
                    return;
                }
                const user: any = {
                    username: params.userName,
                    avatar: './assets/img/zorro.svg',
                    token: '123456789',
                    userId: params.userId,
                    class: params.class,
                    address: params.address,
                    mobile: params.mobile
                };
                this.settingsService.setUser(user);
                localStorage.setItem('customer_user_info_qw',JSON.stringify(user));
                this.router.navigate(['/index']);
            }
        });


    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
