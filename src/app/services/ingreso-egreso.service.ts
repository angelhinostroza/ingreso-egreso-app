import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.models';
import { AuthService } from './auth.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private filestore: AngularFirestore,
              private authService: AuthService) { }

  initIngresoEgresoListener(uid: string) {
    return this.filestore.collection(`${uid}/ingresos-egresos/items`).snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc => ({
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            })
          )
        )
      );
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;
    delete ingresoEgreso.uid;
    return this.filestore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.user.uid;
    return this.filestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
