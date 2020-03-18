import { Injectable, EventEmitter } from '@angular/core';

import { HttpClient, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {
  Router
} from '@angular/router';
import {
  Observable
} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';
 

@Injectable({
  providedIn: 'root'
})

export class webService { 
  public onRefresh :EventEmitter<any> = new EventEmitter();

  BASEURL =  environment.BASEURL;
  refresh(){
    this.onRefresh.emit(true)
  }
    constructor(private _http: HttpClient, private router: Router
        // tslint:disable-next-line: no-shadowed-variable
      ) {
    
      }
       
      
       getTemDta(login_id,pass){
         
    return this._http.get(this.BASEURL+`/thirdparty/api/sensor_data?login_id=${login_id}&password=${pass}`).pipe(
      // eg. "map" without a dot before
      map(data => {
        return data;
      }),
      // "catchError" instead "catch"
      catchError(error => {
        alert("Something went wrong ;)");
        return Observable.throw('Something went wrong ;)');
      }) );
       }
       Kv11data(){ 
        return this._http.get(this.BASEURL+`/thirdparty/api/sensor_details?login_id=dtpoc&password=dtpoc&sensor_id=5e6ceac464de95.94278365 `).pipe(
          // eg. "map" without a dot before
          map(data => {
            return data;
          }),
          // "catchError" instead "catch"
          catchError(error => {
            alert("Something went wrong ;)");
            return Observable.throw('Something went wrong ;)');
          }) );
           }

           Kv33data(){ 
            return this._http.get(this.BASEURL+`/thirdparty/api/sensor_details?login_id=dtpoc&password=dtpoc&sensor_id=5e6cea2e51bb05.80255546`).pipe(
              // eg. "map" without a dot before
              map(data => {
                return data;
              }),
              // "catchError" instead "catch"
              catchError(error => {
                alert("Something went wrong ;)");
                return Observable.throw('Something went wrong ;)');
              }) );
               }
               ambientLoad(date){
                return this._http.get(this.BASEURL+`/thirdparty/api/temperature?login_id=dtpoc&password=dtpoc&sensor_id=5e6a0ceabe8fa3.04563015&datetime=${date}`).pipe(
                  // eg. "map" without a dot before
                  map(data => {
                    return data;
                  }),
                  // "catchError" instead "catch"
                  catchError(error => {
                    alert("Something went wrong ;)");
                    return Observable.throw('Something went wrong ;)');
                  }) );
               }
               wtiLoad(date){
                return this._http.get(this.BASEURL+`/thirdparty/api/temperature?login_id=dtpoc&password=dtpoc&sensor_id=5e634ec6e7b384.17952956&datetime=${date}`).pipe(
                  // eg. "map" without a dot before
                  map(data => {
                    return data;
                  }),
                  // "catchError" instead "catch"
                  catchError(error => {
                    alert("Something went wrong ;)");
                    return Observable.throw('Something went wrong ;)');
                  }) );
               }
                Load(date){
                return this._http.get(this.BASEURL+`/thirdparty/api/load_data?login_id=dtpoc&password=dtpoc&sensor_id=5e6ceac464de95.94278365&datetime=${date} `).pipe(
                  // eg. "map" without a dot before
                  map(data => {
                    return data;
                  }),
                  // "catchError" instead "catch"
                  catchError(error => {
                    alert("Something went wrong ;)");
                    return Observable.throw('Something went wrong ;)');
                  }) );
               }
   alarmGet(){
     return this._http.get(this.BASEURL+'/thirdparty/api/alarm_data?login_id=dtpoc&password=dtpoc').pipe(
        // eg. "map" without a dot before
        map(data => {
          return data;
        }),
        // "catchError" instead "catch"
        catchError(error => {
          alert("Something went wrong ;)");
          return Observable.throw('Something went wrong ;)');
        }) );
   }
    
    // Resident function
  
    
  
  }
  