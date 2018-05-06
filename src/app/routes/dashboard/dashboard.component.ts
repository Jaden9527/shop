import { Component, OnInit, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    // styleUrls: ['./dashboard.component.less']
    styles: [
        `:host ::ng-deep 
      `
    ]
})
export class DashboardComponent {

    query: any = {};
    constructor(
        private http: HttpClient,
        public msg: NzMessageService,
        private injector: Injector,
    ) { }

    ngOninit() {

        this.load();
    }

    load() {

    }

    // 查看
    queryFn() {
        const router = this.injector.get(Router);
        router.navigate(['/index/shop/search'],{ queryParams: { shopName: this.query.search}});
    }

    // 查看更多
    moreFn(data) {
        const router = this.injector.get(Router);
        router.navigate(['/index/shop/search'],{ queryParams: { class: data}});
    }

}
