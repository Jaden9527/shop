import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { environment } from '@env/environment';

import { routes } from './routes';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { RouteguardService } from 'app/routes/routeguard.service';
import { ShopModule } from './shop/shop.module';

@NgModule({
    imports: [
        ShopModule,
        SharedModule,
        RouterModule.forRoot(routes, { useHash: environment.useHash })
    ],
    providers: [
        RouteguardService
    ],
    declarations: [
        DashboardComponent,
        // passport pages
        UserLoginComponent,
        UserRegisterComponent,     
        UserRegisterResultComponent,
        // single pages
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component
    ],
    exports: [
        RouterModule
    ]
})
export class RoutesModule {}
