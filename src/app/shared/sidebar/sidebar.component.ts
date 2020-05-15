import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
      .pipe(
        filter(auth => auth.user !== null)
      )
      .subscribe(({ user }) => {
        this.nombre = user.nombre;
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout() {
    Swal.fire({
      title: 'Cerrando sesión',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.logout().then(() => {
      Swal.close();
      this.router.navigate(['/login']);
    });
  }

}
