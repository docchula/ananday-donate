import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private afa: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afa.authState.pipe(
      first(),
      map((u) => {
        if (next.data.auth) {
          if (u) {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        } else {
          if (u) {
            this.router.navigate(['/admin', 'dashboard']);
            return false;
          } else {
            return true;
          }
        }
      })
    );
  }
}
