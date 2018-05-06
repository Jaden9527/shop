import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import swal, { SweetAlertType } from 'sweetalert2';
import { ShopService } from '../shop.service';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-shopCar',
  templateUrl: './shopCar.component.html',
  styles: []
})
export class ShopCarComponent implements OnInit {
  amount = 0;
  query: any = {};
  list: any = [];

  operateArry: any = [];

  _allChecked = false;
  _indeterminate = false;


  constructor(private service: ShopService,  public settings: SettingsService, private httpClient: HttpClient, private msg: NzMessageService, private fb: FormBuilder) { }

  ngOnInit() {
    this.load();
  }

  /** 查询 */
  load() {
    this.query.userId = this.settings.user.userId;
    this.service.postFn('/shopcar/query', this.query).subscribe((res: any) => {
      if(res.success) {
          this.msg.success('查询成功！');
          this.list = res.info;
      }else {
          this.list = res.info;
          this.msg.error('查询失败!');
      }
    });
  }

  /** 删除 */
  deleteFn(data) {
    data.userId = this.settings.user.userId;
    this.service.postFn('/shopcar/delete', data).subscribe((res: any) => {
      if(res.success) {
        this.msg.success(res.message);
        this.load();
      }else {
        this.msg.error(res.message);
      }
    });
  }

  /** 数量变化 */
  changeFn(num, i) {
    this.query.userId = this.settings.user.userId;
    const num_bef = this.list[i].number;
    this.list[i].number = num;
    this.service.postFn('/shopcar/update', this.list[i]).subscribe((res: any) => {
      if(res.success) {
          this.msg.success(res.message);
          if (this.list[i].checked === true) {
            if(num > num_bef) {
              const num_aft = num - num_bef;
              const price = num_aft * this.list[i].money;
              this.amount += price;
            }else {
              const num_aft = num_bef - num;
              const price = num_aft * this.list[i].money;
              this.amount = this.amount - price;
            }
          }
      }else {
          this.msg.error(res.message);
          this.list[i].number = num_bef;
      }
    });
  }
  /** 表格全选 */
  _checkAll() {
    this.list.forEach(item => item.checked = this._allChecked);
    this.refChecked();
  }

  /** 表格单选 */
  refChecked() {
    this.amount = 0;
    const checkedCount = this.list.filter(w => w.checked).length;
    this.operateArry = this.list.filter(value => value.checked);
    this._allChecked = checkedCount === this.list.length;
    this._indeterminate = this._allChecked ? false : checkedCount > 0;

    for (let i = 0; i <this.operateArry.length; i++) {
        const price = this.operateArry[i].number * this.operateArry[i].money;
        this.amount += price;
      }
    }

  /** 下单 */
  order() {
    for(let i = 0; i <this.operateArry.length; i++) {
      this.operateArry[i].userId = this.settings.user.userId;
      this.operateArry[i].address = this.settings.user.address;
      this.operateArry[i].userName = this.settings.user.username;
      this.operateArry[i].amount = this.operateArry[i].number * this.operateArry[i].money;
      this.operateArry[i].status = 1;
      delete this.operateArry[i].checked;
    }
    this.service.postFn('/shopcar/order', this.operateArry).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.load();
      } else {
        this.msg.success(res.message);
      }
    });
  }

}
