import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import swal, { SweetAlertType } from 'sweetalert2';
import { ShopService } from '../shop.service';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-lowershop',
  templateUrl: './lowershop.component.html',
  styles: []
})
export class LowershopComponent implements OnInit {

  form: FormGroup;
  query: any = {};
  list: any = [];
  showModal = false;

  constructor(private service: ShopService,  public settings: SettingsService, private httpClient: HttpClient, private msg: NzMessageService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      pic: [null],
      shopName: [null],
      shopDesc: [null],
      shopSpec: [null],
      money: [null],
      class: [null],
      shopId: [null]
    });
    this.load();
  }

  /** 查询 */
  load() {
    this.service.postFn('/query/shop', this.query).subscribe((res: any) => {
      if(res.success) {
          this.list = res.info;
      }else {
          this.list = res.info;
          this.msg.error('查询失败!');
      }
    });
  }

  /** 删除 */
  deleteFn(data) {
    this.service.postFn('/shop/lower', data).subscribe((res: any) => {
      if(res.success) {
        this.msg.success(res.message);
        this.load();
      }else {
        this.msg.error(res.message);
      }
    });
  }

  /** 修改商品 */
  updateFn(data) {
    this.form.patchValue(data);
    this.showModal = true;
  }


  handleCancel() {
    this.showModal = false;
    this.form.reset();
  }

  handleOk() {
    const params:any = this.form.getRawValue();

    this.service.postFn('/shop/update', params).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.load();
      } else {
        this.msg.error(res.message);
      }
    });

    this.form.reset();
    this.showModal = false;
  }

}
