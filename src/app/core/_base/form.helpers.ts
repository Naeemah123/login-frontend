import type { AbstractControl, FormGroup } from '@angular/forms';

/** Shared form helper — single place for control-error checks (matches backend rule display). */
export function isControlHasError(
  form: FormGroup,
  controlName: string,
  validationType: string
): boolean {
  const control: AbstractControl | null = form.get(controlName);
  return !!control?.hasError(validationType) && control.touched;
}
