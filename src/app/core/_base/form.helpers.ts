import type { AbstractControl, FormGroup } from '@angular/forms';

export function isControlHasError(
  form: FormGroup,
  controlName: string,
  validationType: string,
): boolean {
  const control: AbstractControl | null = form.get(controlName);

  return (
    !!control?.hasError(validationType) &&
    !!(control.dirty || control.touched)
  );
}