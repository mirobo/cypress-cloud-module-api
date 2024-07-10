import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { someReducer, SomeEffect, featureKey, MyState, reducer } from './ngrx-stuff';
import { SomeService } from './service';
import { EffectsModule } from '@ngrx/effects';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({ count: someReducer }),
    EffectsModule.forRoot([SomeEffect]),
    StoreDevtoolsModule.instrument({
      maxAge: 250, // Retains last 250 states
      autoPause: true, // No impact if devtools are closed
      connectInZone: true,
    }),
  ],
  providers: [HttpClientModule, SomeService],
  bootstrap: [AppComponent],
})
export class AppModule { }

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
