import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  ingresosSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
      .pipe(
        filter(({ user }) => user !== null)
      )
      .subscribe(({ user }) => {
        this.ingresosSubscription = this.ingresoEgresoService.initIngresoEgresoListener(user.uid)
          .subscribe((ingresosEgresosfb) => {
            this.store.dispatch(ingresoEgresoActions.setItems({ items: ingresosEgresosfb }));
          });
      });
  }

  ngOnDestroy(): void {
    this.ingresosSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

}
