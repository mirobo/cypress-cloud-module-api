import { createAction, createReducer } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SomeService } from './service';

export const initialState = {
  counter: 0,
};

export const requestAction = createAction('[API] Trigger Request');

export const someReducer = createReducer(initialState);

@Injectable()
export class SomeEffect {
  counter = 0;
  startRequestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestAction),
      switchMap(() => {
        return this.someService.startRequest('call' + this.counter++).pipe(
          map((response) => {
            console.log(response);
            return { type: 'dummy action', payload: response };
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  constructor(private actions$: Actions, private someService: SomeService) {}
}
