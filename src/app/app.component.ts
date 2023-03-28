import { Component, OnInit } from '@angular/core';
import { SomeService } from './service';
import { Store, select } from '@ngrx/store';
import { fromEvent, Observable, of, switchMap } from 'rxjs';
import { requestAction } from './ngrx-stuff';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [SomeService],
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Tour of Heroes';
  constructor(private store: Store<{counter: number}>) {
  }

  beginRequest() {
    this.store.dispatch(requestAction());
    this.store.dispatch(requestAction());
  }

  ngOnInit(): void {
    this.store.dispatch(requestAction());
  }
}
