import { AbstractControl, ValidatorFn } from '@angular/forms';


export function lettersOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = /^[a-zA-Z\s]*$/.test(control.value);
    return isValid ? null : { 'lettersOnly': { value: control.value } };
  };
}
