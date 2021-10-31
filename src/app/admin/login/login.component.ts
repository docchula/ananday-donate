import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'and-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afa: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: this.fb.control(''),
      password: this.fb.control('')
    });
  }

  ngOnInit() {}

  submit() {
    this.afa
      .signInWithEmailAndPassword(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .then(
        () => {
          this.router.navigate(['./dashboard'], { relativeTo: this.route });
        },
        (reason) => {
          alert(`Email and password combination is incorrect. ${reason}`);
        }
      );
  }
}
