import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TransferService } from './transfer.service';
import { NzInputDirectiveComponent } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-step1',
  template: `
<form nz-form [formGroup]="form"  (ngSubmit)="_submitForm()">
  <div nz-form-item nz-row>
    <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
      <label for="amount">订单金额</label>
    </div>
    <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
      {{item.amount}}元
    </div>
  </div>
  <div nz-form-item nz-row>
    <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
      <label for="address">收货地址</label>
    </div>
    <div nz-form-control nz-col [nzSm]="14" [nzXs]="24">
        <nz-input [nzSize]="'large'" formControlName="address" name="'address'"></nz-input>
    </div>
  </div>
  <div nz-form-item nz-row>
        <div nz-form-control nz-col class="mb-sm text-center">
            <button nz-button [nzType]="'primary'" nzSize="large" [disabled]="form.invalid">下一步</button>
        </div>
    </div>
</form>
    `
})
export class Step1Component implements OnInit {

  @Input() shopId: number;
  @Input() amount: number;
  @Input() address: string;

  form: FormGroup;

  constructor(private fb: FormBuilder, public item: TransferService, private http: HttpClient) { }

  /**
   * 初始化
   */
  ngOnInit() {
    this.form = this.fb.group({
      shopId: [null],
      amount: [null],
      address: [null, [Validators.required]],
    });

    this.item.shopId = this.shopId;
    this.item.amount = this.amount;
    this.item.address = this.address;
    this.form.patchValue(this.item);
  }

  //#region get form fields
  // get id() { return this.form.controls['id']; }
  // get amount() { return this.form.controls['amount']; }
  // get address() { return this.form.controls['address']; }

  //#endregion
  _submitForm() {
    this.item = Object.assign(this.item, this.form.value);
    ++this.item.step;
  }

  public tags = [];
  public inputVisible = false;
  public inputValue = '';
  @ViewChild('input') input: NzInputDirectiveComponent;

  handleClose(removedTag: any): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue) {
      this.tags.push(this.inputValue);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
}
