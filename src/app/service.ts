import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable()
export class SomeService {
  constructor(private http: HttpClient) {}
  startRequest(param: string) {
    return this.http.get('https://httpbin.org/delay/1?param=' + param);
  }
}
