import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import swal, { SweetAlertType } from 'sweetalert2';
import { ShopService } from '../shop.service';
import { SettingsService } from '@delon/theme';


@Component({
  selector: 'app-insertshop',
  templateUrl: './insertshop.component.html',
  styles: []
})
export class InsertshopComponent implements OnInit {

  form: FormGroup;


  constructor(private service: ShopService,  public settings: SettingsService, private httpClient: HttpClient, private msg: NzMessageService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      pic: [null],
      shopName: [null],
      shopDesc: [null],
      shopSpec: [null],
      money: [null],
      class: [null]
    });

  }

  load() {
    const params = this.form.value;
    this.service.postFn('/shop/insert', params).subscribe((res: any) => {
      if(res.success) {
          this.msg.success('上架成功！');
          this.form.reset();
      }else {
          this.msg.error('上架失败!');
      }
    });
  }

}

