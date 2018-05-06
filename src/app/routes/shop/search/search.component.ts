import { Component, OnInit, Injector } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import swal, { SweetAlertType } from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ReuseTabService } from '@delon/abc';
import { ShopService } from '../shop.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styles: [
        `
    :host ::ng-deep .custom-image img {
      display: block;
    }

    :host ::ng-deep .custom-card {
      padding: 10px 16px;
    }

    :host ::ng-deep .custom-card p {
      color: #999;
    }

    :host ::ng-deep .ant-card-body {
      padding: 0;
    }`
    ]
})
export class SearchComponent implements OnInit {

     /**接收传值 */
     shopName = this.route.snapshot.queryParams.shopName;
     class = this.route.snapshot.queryParams.class;

      /* 页面顶部查询的字段存储的对象 */
    query: any = {
        shopName: this.shopName, class: this.class
    };

    /* 页面数据 */
    list: any = [];

    constructor( private http: _HttpClient,
        private route: ActivatedRoute,
        public msg: NzMessageService,
        private fb: FormBuilder,
        private injector: Injector,
        private service: ShopService,
        private reuseTabService: ReuseTabService,
        private titleSrv: TitleService,
        private modal: NzModalService) { }

    ngOnInit() {
        this.list = [];
        this.load();
    }

    load() {
        this.service.postFn('/query/shop', this.query).subscribe((res: any) => {
            if(res.success) {
                this.msg.success('查询成功！');
                this.list = res.info;
            }else {
                this.list = res.info;
                this.msg.error('查询失败!');
            }
          });
    }

    // 查看
    moreFn(params) {
        const router = this.injector.get(Router);
        router.navigate(['/index/shop/details'], { queryParams: { shopId: params.shopId } });
    }

}
