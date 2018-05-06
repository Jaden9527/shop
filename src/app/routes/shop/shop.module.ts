import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UEditorModule } from 'ngx-ueditor';

import { Routes, RouterModule } from '@angular/router';
import { ShopService } from './shop.service';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './details/details.component';
import { BuyNowComponent } from './details/buyNow/buyNow.component';
import { Step1Component } from 'app/routes/shop/details/buyNow/step1.component';
import { Step2Component } from 'app/routes/shop/details/buyNow/step2.component';
import { Step3Component } from 'app/routes/shop/details/buyNow/step3.component';
import { ShopCarComponent } from './shopCar/shopCar.component';
import { OrderComponent } from './order/order.component';
import { InsertshopComponent } from './insertshop/insertshop.component';
import { AdminorderComponent } from './adminorder/adminorder.component';
import { UserupdateComponent } from './userupdate/userupdate.component';
import { LowershopComponent } from './lowershop/lowershop.component';
import { AdminissuesComponent } from './adminissues/adminissues.component';


const routes: Routes = [  
  { path: 'search', component: SearchComponent, data: { text: '查询' } },
  { path: 'details', component: DetailsComponent, data: { text: '商品详情' } },
  { path: 'shopcar', component: ShopCarComponent, data: { text: '购物车' } },
  { path: 'order', component: OrderComponent, data: { text: '我的订单' } },
  { path: 'insertshop', component: InsertshopComponent, data: { text: '上架商品' } },
  { path: 'adminorder', component: AdminorderComponent, data: { text: '订单详情' } },
  { path: 'userupdate', component: UserupdateComponent, data: { text: '修改资料' } },
  { path: 'lowershop', component: LowershopComponent, data: { text: '下架商品' } },
  { path: 'adminissues', component: AdminissuesComponent, data: { text: '留言管理' } },
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    UEditorModule.forRoot({
      // 指定ueditor.js路径目录
      path: '//apps.bdimg.com/libs/ueditor/1.4.3.1/',
      // 默认全局配置项
      options: {
          themePath: '//apps.bdimg.com/libs/ueditor/1.4.3.1/themes/'
      }
  }),
  ],
  declarations: [
    SearchComponent,
    DetailsComponent,
    BuyNowComponent,
    Step1Component, 
    Step2Component,
    Step3Component,
    ShopCarComponent,
    OrderComponent,
    InsertshopComponent,
    AdminorderComponent,
    UserupdateComponent,
    LowershopComponent,
    AdminissuesComponent
],
  entryComponents: [ SearchComponent,DetailsComponent, BuyNowComponent,ShopCarComponent,
    OrderComponent] ,
  /**注入 Service */
  providers: [ShopService]
  
})
export class ShopModule { }
