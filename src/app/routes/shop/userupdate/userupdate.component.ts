import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ShopService } from '../shop.service';
import { SettingsService } from '@delon/theme';
import { Params } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject, NzModalService} from 'ng-zorro-antd';
import { isNullOrUndefined } from 'util';
import swal, { SweetAlertType } from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { map, delay, debounceTime } from 'rxjs/operators'; 
import { ModalHelper } from '@delon/theme';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styles: []
})
export class UserupdateComponent implements OnInit {

  form: FormGroup;
  basic: FormGroup; 
  showModal = false;
  status = 'pool';
    progress = 0;
    passwordProgressMap = {
        ok: 'success',
        pass: 'normal',
        pool: 'exception'
    };


  constructor(private service: ShopService,  public settings: SettingsService, private httpClient: HttpClient, private msg: NzMessageService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      userName: this.settings.user.username,
      address:this.settings.user.address,
      mobile: this.settings.user.mobile,
      userId: this.settings.user.userId,
      account: this.settings.user.account,
    });
    this.basic = this.fb.group({
      userId: [null],
      password: [ null, [ Validators.required ] ],
      checkPassword: [ null, [ Validators.required,  this.confirmationValidator] ]
    });
  }

  load() {
    const params = this.form.value;
    this.service.postFn('/user/update', params).subscribe((res: any) => {
      if(res.success) {
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
          this.settings.setUser(user);
          this.msg.success('修改成功！');
      }else {
          this.msg.error('修改失败!');
      }
    });
  }

  resetFn() {
    const params = {
      userId: this.settings.user.userId,
    }
    this.basic.patchValue(params);
    this.showModal = true;
  }

  handleCancel() {
    this.showModal = false;
    this.basic.reset();
  }

  handleOk() {
    const params:any = this.basic.getRawValue();

    this.service.postFn('/user/password', params).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
      } else {
        this.msg.error(res.message);
      }
    });

    this.basic.reset();
    this.showModal = false;
  }


    /** 密码验证 */
    getFormControl(name) {
      return this.basic.controls[ name ];
    }
  
    updateConfirmValidator() {
      /** wait for refresh value */
      setTimeout(_ => {
        this.basic.controls[ 'checkPassword' ].updateValueAndValidity();
      });
    }
  
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) {
        return { required: true };
      } else if (control.value !== this.basic.controls[ 'password' ].value) {
        return { confirm: true, error: true };
      }
    };
  
    getCaptcha(e: MouseEvent) {
      e.preventDefault();
    }

}


