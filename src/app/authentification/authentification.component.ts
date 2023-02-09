import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
})
export class AuthentificationComponent {
  public form: FormGroup = this.fb.group({});

  constructor(public appServices: AppService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.form.statusChanges.subscribe(() => {});
  }

  private createForm(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  public login(): void {
    if (this.form.valid) {
      this.appServices.callApi(
        this.form.get('username')?.value,
        this.form.get('password')?.value
      );
    }
  }
}
