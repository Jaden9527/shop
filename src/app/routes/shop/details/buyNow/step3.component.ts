import { Component, OnInit, Injector } from '@angular/core';
import { TransferService } from './transfer.service';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-step3',
    template: `
    <div style="text-align: center;">
        <div class="icon pt-md"><i class="anticon anticon-check-circle text-success icon-lg"></i></div>
        <span class="h2 pt-md">下单成功</span>
        <span nz-table-divider></span>
        <button nz-button (click)="order()" class="h2 pt-md" style="border:0px;color:#348ECF;padding:0px">查看订单</button>
    </div>
    `
})
export class Step3Component implements OnInit {

    personnel: any = [];
    repoNames: any = [];
    form: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
         public item: TransferService, 
        private http: HttpClient, 
        private msg: NzMessageService,        
        private injector: Injector,
        private subject: NzModalSubject) {}

    ngOnInit() {
        this.form = this.fb.group({});
        
        this.form.patchValue(this.item);
       }

    prev() {
        --this.item.step;
    }
    
    order() {
        const router = this.injector.get(Router);
        router.navigate(['/index/shop/order']);
        this.cancelFn();
    }

    cancelFn() {
        this.subject.destroy();
      }
}
