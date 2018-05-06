import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransferService } from './transfer.service';
import { NzMessageService, NzModalSubject } from 'ng-zorro-antd';

@Component({
    selector: 'app-step2',
    template: `
    <form nz-form [formGroup]="form" >
    <div nz-form-item nz-row>
    <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
      <label for="number">订单金额</label>
    </div>
    <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
        {{item.amount}}
    </div>
  </div>
  <div nz-form-item nz-row>
    <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
      <label for="percent">收货地址</label>
    </div>
    <div nz-form-control nz-col [nzSm]="14" [nzXs]="24">
        {{item.address}}
    </div>
  </div>
  <div nz-form-item nz-row>
    <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
      <label for="password">支付密码</label>
    </div>
    <div nz-form-control nz-col [nzSm]="14" [nzXs]="24">
        <nz-input [nzSize]="'large'" formControlName="password" name="'password'" [nzType]="'password'"></nz-input>
        <div nz-form-explain *ngIf="getFormControl('password').dirty&&getFormControl('password').hasError('required')">请输入密码!</div>
        <div nz-form-explain *ngIf="getFormControl('password').dirty&&getFormControl('password').hasError('minlength')">至少6位数以上!</div>
    </div>
  </div>
    <div nz-form-item nz-row>
            <div nz-form-control nz-col class="mb-sm text-center">
                <button nz-button [nzType]="'primary'" nzSize="large" (click)="ok()" >提交</button>
                <button nz-button (click)="prev()" nzSize="large" [nzType]="'primary'">上一步</button>
            </div>
        </div>
    </form>
    `
})
export class Step2Component implements OnInit {
    form: FormGroup;
    loading = false;


    constructor(private fb: FormBuilder, public item: TransferService, private http: HttpClient, private msg: NzMessageService, private subject: NzModalSubject) { }

    ngOnInit() {
        this.form = this.fb.group({
            password: [null, [ Validators.required, Validators.minLength(6) ]],
            id: [null],
            number: [null],
            money: [null],
            amount: [null],
            address: [null, [Validators.required]],
        });
        this.form.patchValue(this.item);
    }

        /** 密码验证 */
    getFormControl(name) {
        return this.form.controls[ name ];
      }

      getCaptcha(e: MouseEvent) {
        e.preventDefault();
      }

    //#region get form fields
    get password() { return this.form.controls.password; }
    get development() { return this.form.controls['development']; }
    get test() { return this.form.controls['test']; }
    get demand() { return this.form.controls['demand']; }
    get adviser() { return this.form.controls['adviser']; }
    get administrator() { return this.form.controls['administrator']; }
    //#endregion
    _submitForm() {
        // this.item = Object.assign(this.item, this.form.value);
        ++this.item.step;
    }
    // _submitForm() {
    //     this.loading = true;
    //     setTimeout(() => {
    //         this.loading = false;
    //         ++this.item.step;
    //     });
    // }

    prev() {
        --this.item.step;
    }

    ok() {
        this.http.post('http://localhost:7001/order', this.item).subscribe((res: any) => {
            if (res.success) {
                this.subject.next('success');
                this.msg.success(res.message);
                ++this.item.step;
            }
        });
    }

    cancelFn() {
        this.subject.destroy();
    }
}