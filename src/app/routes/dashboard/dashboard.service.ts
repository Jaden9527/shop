import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpClient} from '@angular/common/http';

@Injectable()
export class DashboardService {

constructor(private http: HttpClient) { }

    get(params: any) {
        const url = '';
        return this.http.get(url, params);
    }

    delete(avatar: any) {
        const url = '';
        return this.http.get(url, avatar);
    }
}
