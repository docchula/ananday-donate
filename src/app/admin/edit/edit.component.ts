import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
import undefined from 'firebase/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'and-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  donation$: Observable<any>;
  donationRef$: Observable<firebase.database.Reference>;
  slipUrl: Observable<string>;
  badge_shipping_code: FormControl;
  receipt_code: FormControl;
  receipt_shipping_code: FormControl;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afd: AngularFireDatabase,
    private afs: AngularFireStorage,
    private afa: AngularFireAuth,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.donation$ = this.route.paramMap.pipe(
      map((p) => p.get('id')),
      switchMap((id) => {
        return this.afd.object(`donations/${id}`).valueChanges();
      })
    );
    this.donationRef$ = this.route.paramMap.pipe(
      map((p) => p.get('id')),
      map((id) => {
        return this.afd.database.ref(`donations/${id}`);
      })
    );
    this.slipUrl = this.donation$.pipe(
      switchMap((d) =>
        this.afs.ref(`donations/${d.register.slip_fileName}`).getDownloadURL()
      )
    );
    this.badge_shipping_code = this.fb.control('', Validators.required);
    this.receipt_code = this.fb.control('', Validators.required);
    this.receipt_shipping_code = this.fb.control('', Validators.required);
  }

  check(pass: boolean) {
    combineLatest([
      this.afa.authState.pipe(first()),
      this.donationRef$.pipe(first())
    ]).subscribe(([user, ref]) => {
      ref.update({
        check: {
          pass,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          checked_by: user.email.split('@')[0]
        }
      });
    });
  }

  prepareBadge() {
    this.donationRef$.pipe(first()).subscribe((ref) => {
      ref.update({
        badge: true
      });
    });
  }

  shipBadge(shipping_type: string) {
    this.donationRef$.pipe(first()).subscribe((ref) => {
      const val: any = { done: true };
      if (shipping_type === 'registered') {
        val.code = this.badge_shipping_code.value;
      }
      ref.update({
        badge_shipping: val
      });
    });
  }

  prepareReceipt() {
    this.donationRef$.pipe(first()).subscribe((ref) => {
      ref.update({
        receipt: {
          done: true,
          code: this.receipt_code.value
        }
      });
    });
  }

  shipReceipt(shipping_type: string) {
    this.donationRef$.pipe(first()).subscribe((ref) => {
      const val: any = { done: true };
      if (shipping_type === 'registered') {
        val.code = this.receipt_shipping_code.value;
      }
      ref.update({
        receipt_shipping: val
      });
    });
  }
}
