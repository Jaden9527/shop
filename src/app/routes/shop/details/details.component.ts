import { Component, OnInit, Injector } from '@angular/core';
import { BuyNowComponent } from './buyNow/buyNow.component';
import { _HttpClient, TitleService, SettingsService } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder } from '@angular/forms';
import { ReuseTabService } from '@delon/abc';
import swal from 'sweetalert2';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styles: []
})
export class DetailsComponent implements OnInit {

  /**接收传值 */
  shopId = this.route.snapshot.queryParams.shopId;
  query: any = {};
  issues: any = {};

  judge = [];
  options = [];
  rate: number = 0;
  num: number = 0;

  constructor(private http: _HttpClient,
    public settings: SettingsService,
    private route: ActivatedRoute,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private injector: Injector,
    private service: ShopService,
    private reuseTabService: ReuseTabService,
    private titleSrv: TitleService,
    private modal: NzModalService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.postFn('/query/shop', { shopId: this.shopId }).subscribe((res: any) => {
      if (res.success) {
        this.query = res.info[0];
        this.query.number = 1;
        this.judgeFn();
        this.issuesFn();
      } else {
        this.msg.error(res.message);
      }
    });
  }

  /** 评价查询 */
  judgeFn() {
    this.service.postFn('/query/shopjudge', { shopId: this.shopId }).subscribe((res: any) => {
      if (res.success) {
        this.judge = res.info;
        this.num = 0;
        this.rate = 0;
        const params = 5 * this.judge.length;
        for (let i = 0; i < this.judge.length; i++) {
          this.num = this.judge[i].number + this.num;
        }
        this.rate = (this.num / params) * 100;
        if (this.judge[0].number === null || this.judge[0].number === undefined) {
          this.rate = 0;
        }

      } else {
        this.msg.error(res.message);
      }
    });
  }

  /** 问答查询 */
  issuesFn() {
    this.service.postFn('/issues/query', { shopId: this.shopId }).subscribe((res: any) => {
      if (res.success) {
        this.options = res.info;
      } else {
        this.msg.error(res.message);
      }
    });
  }

  /** 立即购买 */
  buy() {
    const amount = this.query.number * this.query.money;
    this.modal.open({
      wrapClassName: 'modal-lg',
      content: BuyNowComponent,
      footer: false,
      maskClosable: false,
      componentParams: {
        shopId: this.query.shopId,
        number: this.query.number,
        money: this.query.money,
        amount: amount,
        pic: this.query.pic,
        shopName: this.query.shopName,
        userId: this.settings.user.userId,
        address: this.settings.user.address,
        userName: this.settings.user.username,

      }
    }).subscribe(result => {
      if (result === 'success') {

      }
    });
  }

  /** 购物车 */
  shopcar() {
    const params = this.query;
    params.userId = this.settings.user.userId;
    this.service.postFn('/shopcar/insert', params).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
      } else {
        this.msg.error(res.message);
      }
    });
  }

  /** 提问 */
  question(){
    this.issues['questionName'] = this.settings.user.username;
    this.issues['questionDate'] = new Date();
    this.issues['shopId'] = this.shopId;
    this.issues['status'] = 0;
    this.issues['pic'] = this.query.pic;
    this.issues['shopName'] = this.query.shopName;
    this.service.postFn('/issues/insert', this.issues).subscribe((res: any) => {
      if (res.success) {
        this.issuesFn();
        this.issues = {};
      } else {
        this.msg.error(res.message);
      }
    });
  }
}
