import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.models';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresoSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresoSubscription = this.store.select('ingresosEgresos')
      .subscribe(({ items }) => this.ingresosEgresos = items);
  }

  ngOnDestroy(): void {
    this.ingresoSubscription.unsubscribe();
  }

  borrar(uid: string) {
    console.log(uid);
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( res => Swal.fire('Borrado', 'Item borrado', 'warning'))
      .catch(err => Swal.fire('Error', err.message, 'error'));
  }

}
