import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { ComplexFormService } from '../../services/complex-form.service';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss'],
})
export class ComplexFormComponent implements OnInit {
  loading = false;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  phoneCtrl!: FormControl;
  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;
  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private complexFormService: ComplexFormService
  ) {}

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservable();
  }

  private initMainForm() {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm,
    });
  }

  private initFormControls() {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.contactPreferenceCtrl = this.formBuilder.control('email');
    this.emailCtrl = this.formBuilder.control('', [Validators.email]);
    this.confirmEmailCtrl = this.formBuilder.control('', Validators.email);
    this.emailForm = this.formBuilder.group(
      {
        email: this.emailCtrl,
        confirm: this.confirmEmailCtrl,
      },
      {
        validators: [confirmEqualValidator('email', 'confirm')],
        updateOn: 'blur',
      }
    );
    this.phoneCtrl = this.formBuilder.control('');
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control(
      '',
      Validators.required
    );
    this.loginInfoForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
      },
      {
        validators: [confirmEqualValidator('password', 'confirmPassword')],
        updateOn: 'blur',
      }
    );
  }

  private initFormObservable() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map((preference) => preference === 'email'),
      tap((showEmail) => this.setEmailValidator(showEmail))
    );

    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map((preference) => preference === 'phone'),
      tap((showPhone) => this.setPhoneValidator(showPhone))
    );

    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.emailCtrl.value &&
          this.confirmEmailCtrl.value
      )
    );

    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.passwordCtrl.value &&
          this.confirmPasswordCtrl.value &&
          this.loginInfoForm.hasError('confirmEqual')
      )
    );
  }

  private setPhoneValidator(showPhone: boolean) {
    if (showPhone) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else {
      this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity();
  }

  private setEmailValidator(showEmail: boolean) {
    if (showEmail) {
      this.emailCtrl.addValidators([Validators.required, Validators.email]);
      this.confirmEmailCtrl.addValidators([
        Validators.required,
        Validators.email,
      ]);
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
    }
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  getFormCtrlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      return "Merci d'entre une adresse email valid";
    } else if (ctrl.hasError('minlength')) {
      return 'Cenuméro de téléphone contient pas assez de chiffre';
    } else if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone contient trop de chiffre';
    } else {
      return 'Ce champ contient une erreur';
    }
  }

  onSubmitForm() {
    this.loading = true;
    this.complexFormService
      .saveUserInfo(this.mainForm.value)
      .pipe(
        tap((saved) => {
          this.loading = false;
          if (saved) {
            this.resetForm();
          } else {
            console.log("Echec de l'enregistrement");
          }
        })
      )
      .subscribe();
  }

  private resetForm() {
    this.mainForm.reset();
    this.contactPreferenceCtrl.patchValue('email');
  }
}
