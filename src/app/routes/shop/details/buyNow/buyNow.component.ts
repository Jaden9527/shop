import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { TransferService } from './transfer.service';


@Component({
  selector: 'app-buyNow',
  templateUrl: './buyNow.component.html',
  providers: [TransferService],
  styles: []
})
export class BuyNowComponent implements AfterViewInit {

  @Input() userId: number;
  @Input() number: number;
  @Input() money: number;
  @Input() amount: number;
  @Input() shopId: number;
  @Input() pic: string;
  @Input() shopName: string;
  @Input() userName: string;
  @Input() address: string;

  ngAfterViewInit() {
    this.item.userId = this.userId;
    this.item.shopId = this.shopId;
    this.item.number = this.number;
    this.item.money = this.money;
    this.item.amount = this.amount;
    this.item.pic = this.pic;
    this.item.shopName = this.shopName;
    this.item.userName = this.userName;
    this.item.address = this.address;
    console.log('item', this.item);
  }

  title: string;

  constructor(public item: TransferService, private subject: NzModalSubject, private http: HttpClient, private msg: NzMessageService) { }

  cancelFn() {
    this.subject.destroy();
  }

  ok() {
    if (isNullOrUndefined(this.title)) {
      this.action('/save/');
    } else {
      this.action('/edit/');
    }
  }

  action(url: string) {
    this.http.post(url, this.item).subscribe((res: any) => {
      this.msg.success(res.message);
      if (res.success) {
        this.subject.next('success');
        this.cancelFn();
      }
    });
  }

}
