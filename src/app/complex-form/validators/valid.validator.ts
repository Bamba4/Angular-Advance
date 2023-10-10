import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validValidator(): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (ctrl.value.includes('VALID')) {
      return null;
    }
    return {
      validValidator: ctrl.value,
    };
  };
}
