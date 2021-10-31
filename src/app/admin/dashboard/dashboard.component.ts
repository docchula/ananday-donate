import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'and-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  allDonations$: Observable<any[]>;
  filteredDonations$: Observable<any[]>;
  dateFilteredDonations$: Observable<any[]>;
  currentMode$: Observable<string>;
  dateFilter$: BehaviorSubject<string>;
  date: FormControl;
  constructor(
    private afd: AngularFireDatabase,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.allDonations$ = this.afd
      .list('donations', (ref) => {
        return ref.orderByChild('register/timestamp');
      })
      .valueChanges();
    this.currentMode$ = this.route.paramMap.pipe(
      map((p) => p.get('mode')),
      map((mode) => {
        if (mode) {
          return mode;
        } else {
          return 'all';
        }
      })
    );
    this.dateFilter$ = new BehaviorSubject<string>('');
    this.filteredDonations$ = this.currentMode$.pipe(
      switchMap((mode) => {
        switch (mode) {
          case 'all':
            return this.allDonations$;
          case 'check':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return !d.check;
                });
              })
            );
          case 'prepare_badge':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return (
                    d.check &&
                    d.check.pass &&
                    !d.badge &&
                    d.register.badge_amount > 0
                  );
                });
              })
            );
          case 'ship_badge':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return (
                    d.check && d.check.pass && d.badge && !d.badge_shipping
                  );
                });
              })
            );
          case 'prepare_receipt':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return (
                    d.register.receipt &&
                    d.check &&
                    d.check.pass &&
                    ((d.badge_shipping && !d.receipt) ||
                      (d.register.badge_amount === 0 && !d.receipt))
                  );
                });
              })
            );
          case 'ship_receipt':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return (
                    d.check && d.check.pass && d.receipt && !d.receipt_shipping
                  );
                });
              })
            );
          case 'done':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return (
                    (d.register.badge_amount === 0 || d.badge_shipping) &&
                    (!d.register.receipt || d.receipt_shipping) &&
                    d.check &&
                    d.check.pass
                  );
                });
              })
            );
          case 'not_pass':
            return this.allDonations$.pipe(
              map((ds) => {
                return ds.filter((d) => {
                  return d.check && !d.check.pass;
                });
              })
            );
          default:
            return this.allDonations$;
        }
      })
    );
    this.dateFilteredDonations$ = this.dateFilter$.pipe(
      switchMap((da) => {
        return this.filteredDonations$.pipe(
          map((ds) => {
            return ds.filter((d) => {
              if (da === '') {
                return true;
              } else {
                return d.register.donation_date === da;
              }
            });
          })
        );
      })
    );
    this.date = this.fb.control(null);
  }

  applyFilter() {
    this.dateFilter$.next(this.date.value);
  }

  clearFilter() {
    this.dateFilter$.next('');
  }
}
