import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
              public filestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      if (fuser) {
        this.userSubscription = this.filestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestore: any) => {
            console.log({firestore});
            const user = Usuario.fromFireStore(firestore);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.filestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbuser => fbuser !== null)
    );
  }

}
