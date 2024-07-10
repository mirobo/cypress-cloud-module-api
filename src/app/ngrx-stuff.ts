import { createAction, createReducer, on, props, createSelector, createFeatureSelector, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SomeService } from './service';

export const initialState: MyState = {
  counter: 0,
};

export type MyState = {
  counter: number;
};

export const requestAction = createAction('[API] Start Request');

export const apiCallResponseSuccess = createAction('[API] Response Success', props<{ counter: number }>());

export const someReducer = createReducer(initialState,
  on(apiCallResponseSuccess, (state, { counter }): MyState => ({
    ...state,
    counter: counter
  }))
);

export function reducer(state: MyState | undefined, action: Action) {
  return someReducer(state, action);
}

export const featureKey = 'count';



export const selectFeature = createFeatureSelector<MyState>(featureKey);

export const selectCounter = createSelector(
  selectFeature,
  (state: MyState) => state.counter
);

@Injectable()
export class SomeEffect {
  counter = 0;
  startRequestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestAction),
      switchMap(() => {
        this.counter++;
        return this.someService.startRequest('call' + this.counter).pipe(
          map((response) => {
            console.log('counter', this.counter, 'response', response);
            return apiCallResponseSuccess({ counter: this.counter })
            // return { type: 'dummy action', payload: response };
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  constructor(private actions$: Actions, private someService: SomeService) { }
}
