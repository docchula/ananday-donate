import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FirebaseApp } from '@angular/fire';
import 'firebase/functions';
import { RecaptchaComponent } from '../ng-recaptcha';
import { Observable, combineLatest } from 'rxjs';
import { first, map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

const shippingTypeValidator: ValidatorFn = (control: AbstractControl) => {
  if (control.value === 'registered' || control.value === 'normal') {
    return null;
  } else {
    return {
      shipping_type: true
    };
  }
};

const conditionallyRequired = (
  condition: (...values: any[]) => boolean,
  ...controlNames: string[]
) => {
  return (control: AbstractControl) => {
    if (condition(...controlNames.map((name) => control.get(name).value))) {
      const errors = Validators.required(control.get(controlNames[0]));
      if (errors && errors.required) {
        const errorName = `${controlNames[0]}_required`;
        return {
          [errorName]: true
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
};

const validateBadgeAmount = (control: AbstractControl) => {
  const donation_amount = control.get('donation_amount').value;
  const badge_amount_control = control.get('badge_amount');
  const shipping_type = control.get('shipping_type').value;
  let max_amount = 0;
  if (shipping_type === 'registered') {
    max_amount = Math.floor((donation_amount - 40) / 100);
  } else {
    max_amount = Math.floor(donation_amount / 100);
  }
  if (control.get('badge_amount').value > max_amount) {
    return {
      max_badge_amount: true
    };
  } else {
    return null;
  }
};

@Component({
  selector: 'and-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('captchaRef', { static: true }) reCaptcha: RecaptchaComponent;
  registerForm: FormGroup;
  maxBadge$: Observable<number>;
  fileName: string;
  noFileName: string;
  submitting = false;
  constructor(
    private firebase: FirebaseApp,
    private fb: FormBuilder,
    private translate: TranslocoService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group(
      {
        name: this.fb.control('', Validators.required),
        telephone: this.fb.control('', [
          Validators.required,
          Validators.pattern(/0\d{8,9}/)
        ]),
        email: this.fb.control('', [Validators.email]),
        shipping_address: this.fb.control('', Validators.required),
        shipping_type: this.fb.control('', shippingTypeValidator),
        receipt: this.fb.control(null, Validators.required),
        receipt_same_details: this.fb.control(false, Validators.required),
        receipt_name: this.fb.control(''),
        receipt_address: this.fb.control(''),
        donation_amount: this.fb.control(0, Validators.required),
        donation_date: this.fb.control(null, Validators.required),
        donation_time: this.fb.control(null, Validators.required),
        badge_amount: this.fb.control(0, Validators.required),
        slip_file: this.fb.control(null, Validators.required)
      },
      {
        validator: [
          conditionallyRequired(
            (_, v2, v3) => {
              return v2 === false && v3 === true;
            },
            'receipt_name',
            'receipt_same_details',
            'receipt'
          ),
          conditionallyRequired(
            (_, v2, v3) => {
              return v2 === false && v3 === true;
            },
            'receipt_address',
            'receipt_same_details',
            'receipt'
          ),
          validateBadgeAmount
        ]
      }
    );
    this.registerForm.valueChanges.subscribe(
      ({ receipt_same_details, receipt }) => {
        if (receipt === false) {
          this.registerForm
            .get('receipt_same_details')
            .disable({ emitEvent: false });
          this.registerForm.get('receipt_name').disable({ emitEvent: false });
          this.registerForm
            .get('receipt_address')
            .disable({ emitEvent: false });
        } else {
          this.registerForm
            .get('receipt_same_details')
            .enable({ emitEvent: false });
          if (receipt_same_details === true) {
            this.registerForm.get('receipt_name').disable({ emitEvent: false });
            this.registerForm
              .get('receipt_address')
              .disable({ emitEvent: false });
          } else {
            this.registerForm.get('receipt_name').enable({ emitEvent: false });
            this.registerForm
              .get('receipt_address')
              .enable({ emitEvent: false });
          }
        }
      }
    );
    this.maxBadge$ = combineLatest([
      this.registerForm.get('donation_amount').valueChanges,
      this.registerForm.get('shipping_type').valueChanges
    ]).pipe(
      map(([amount, shipping_type]) => {
        if (shipping_type === 'registered') {
          return Math.floor((amount - 40) / 100);
        } else {
          return Math.floor(amount / 100);
        }
      })
    );
    const sub = this.translate
      .selectTranslate('register.donation-details.no-file')
      .pipe(first())
      .subscribe((t) => {
        this.noFileName = t;
        this.fileName = t;
      });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get telephone() {
    return this.registerForm.get('telephone');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get shipping_address() {
    return this.registerForm.get('shipping_address');
  }

  get receipt_name() {
    return this.registerForm.get('receipt_name');
  }

  get receipt_address() {
    return this.registerForm.get('receipt_address');
  }

  get donation_amount() {
    return this.registerForm.get('donation_amount');
  }

  get donation_date() {
    return this.registerForm.get('donation_date');
  }

  get donation_time() {
    return this.registerForm.get('donation_time');
  }

  get badge_amount() {
    return this.registerForm.get('badge_amount');
  }

  get slip_file() {
    return this.registerForm.get('slip_file');
  }

  ngOnInit() {}

  submit(reCaptchaResponse: string) {
    const rawFormData = this.registerForm.value;
    const { receipt_same_details, receipt_name, receipt_address, ...formData } =
      rawFormData;
    if (formData.receipt) {
      if (receipt_same_details) {
        formData.receipt_name = formData.name;
        formData.receipt_address = formData.shipping_address;
      } else {
        formData.receipt_name = receipt_name;
        formData.receipt_address = receipt_address;
      }
    }
    formData.reCaptchaResponse = reCaptchaResponse;
    const register = this.firebase.functions().httpsCallable('register');
    register(formData)
      .then((result) => {
        const { success, track_code } = result.data;
        if (success) {
          this.router.navigate(['/track', track_code], {
            relativeTo: this.route
          });
        } else {
          this.submitting = false;
        }
      })
      .catch((error) => {
        console.log('Error');
        console.log(error);
      });
  }

  presubmit() {
    if (this.registerForm.valid) {
      this.submitting = true;
      this.reCaptcha.reset();
      this.reCaptcha.execute();
    }
  }

  onFileChanged(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const twoMegabytes = 2 * 1024 * 1024;
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    if (
      file.size > twoMegabytes ||
      allowedFileTypes.indexOf(file.type) === -1
    ) {
      this.translate
        .selectTranslate('register.donation-details.invalid-file')
        .pipe(first())
        .subscribe((t) => {
          alert(t);
          this.fileName = this.noFileName;
        });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.registerForm.patchValue({
          slip_file: reader.result
        });
        this.cd.markForCheck();
      };
      this.fileName = file.name;
    }
  }
}
