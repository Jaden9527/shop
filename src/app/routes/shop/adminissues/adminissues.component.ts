import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import swal, { SweetAlertType } from 'sweetalert2';
import { ShopService } from '../shop.service';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-adminissues',
  templateUrl: './adminissues.component.html',
  styles: []
})
export class AdminissuesComponent implements OnInit {

  list = [];
  list1 = [];
  showModal = false;
  form: FormGroup;
  constructor(private service: ShopService,  public settings: SettingsService, private httpClient: HttpClient, private msg: NzMessageService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      questionId: [null],
      answer: [null],
      answerName: [null],
      answerDate: [null],
      status: [null],
    });
    this.load();
  }

  /** 查询 */
  load() {
    this.service.postFn('/issues/admin',{}).subscribe((res: any) => {
      if(res.success) {
        this.list = [];
        this.list1 = [];
        for(let i = 0; i < res.info.length; i++) {
          if(res.info[i].status === 0) {
            this.list.push(res.info[i]);
          }else {
            this.list1.push(res.info[i]);
          }
        }
      }else {
          this.list = res.info;
          this.msg.error('查询失败!');
      }
    });
  }

  /** 删除 */
  deleteFn(data) {
    this.service.postFn('/issues/delete', data).subscribe((res: any) => {
      if(res.success) {
        this.msg.success(res.message);
        this.load();
      }else {
        this.msg.error(res.message);
      }
    });
  }

  /** 回复 */
  answerFn(data) {
    const params = {
      answerName: this.settings.user.username,
      questionId: data,
      answerDate: new Date(),
      status: 1,
    }
    this.form.patchValue(params);
    this.showModal = true;
  }


  handleCancel() {
    this.showModal = false;
    this.form.reset();
  }

  handleOk() {
    const params:any = this.form.getRawValue();

    this.service.postFn('/issues/answer', params).subscribe((res: any) => {
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
