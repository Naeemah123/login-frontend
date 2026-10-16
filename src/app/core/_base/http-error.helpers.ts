
import { HttpErrorResponse } from '@angular/common/http';

interface BackendResponse {
  response?: {
    message?: string;
    errors?: string[] | Record<string, string[]>;
  };
}

export function getHttpErrorMessage(
  error: unknown,
  fallback = 'The server has a problem. Try again later.',
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as BackendResponse | null;
  const response = body?.response;
  const backendMessage = response?.message;
  const errors = response?.errors;

  switch (error.status) {
    case 0:
      return 'Cannot connect to the server. Check your internet connection.';

    case 400:
      return getValidationMessage(errors, backendMessage) || 'Invalid request data.';

    case 401:
      return 'Invalid email or password.';

    case 403:
      return 'Your account is locked or suspended. Contact support.';

    case 404:
      return 'Account not found. Check your email or register.';

    case 409:
      return backendMessage || 'An account with these details already exists.';

    case 422:
      return getValidationMessage(errors, backendMessage) || 'Please check the submitted fields.';

    case 429:
      return 'Too many attempts. Wait a few minutes and try again.';

    default:
      if (error.status >= 500) {
        return 'The server has a problem. Try again later.';
      }

      return backendMessage || fallback;
  }
}

function getValidationMessage(
  errors: string[] | Record<string, string[]> | undefined,
  backendMessage?: string,
): string | undefined {
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join('; ');
  }

  if (errors && !Array.isArray(errors)) {
    const messages = Object.values(errors).flat().filter(Boolean);

    if (messages.length > 0) {
      return messages.join('; ');
    }
  }

  return backendMessage;
}
