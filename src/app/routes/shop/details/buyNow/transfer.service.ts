import { Injectable } from '@angular/core';

@Injectable()
export class TransferService {

    step: 0 | 1 | 2 = 1;

    /**
     * id
     */
    userId: number;

    /**
     * 支付密码
     */
    password = '123456';
    /** 订单金额 */
    amount: number;

    /** 商品单价 */
    money: number;

    /** 订单数量 */
    number: number;

    /** 收货地址 */
    address: string;

     /** 收货人 */
     userName: string;

    
  shopId: number;
  pic: string;
  shopName: string;

    again() {
        this.step = 0;
        this.amount = 0;
        this.shopId = 0;
        this.address = '';
    }

    constructor() {
        this.again();
    }
}
