import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { setUpTestBed } from '@testing/common.spec';
import { DashboardComponent } from './dashboard.component';

describe('Comoponent: Dashboard', () => {
    setUpTestBed(<TestModuleMetadata>{
        declarations: [ DashboardComponent ]
    });

    it('should create an instance', () => {
        const fixture = TestBed.createComponent(DashboardComponent);
        const comp = fixture.debugElement.componentInstance;
        expect(comp).toBeTruthy();
    });
});
