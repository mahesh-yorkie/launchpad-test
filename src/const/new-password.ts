import { AUTH_BRANDING_COPY } from '@/const/auth-branding'

export const NEW_PASSWORD_COPY = {
  ...AUTH_BRANDING_COPY,
  title: 'Set your new password',
  description:
    'Ensure that your new password differs from previously used passwords.',
  passwordLabel: 'Password',
  confirmLabel: 'Confirm New Password',
  requirementMin: 'Minimum 8 characters',
  requirementUpper: 'At least 1 uppercase letter',
  requirementNumber: 'At least 1 number',
  requirementSpecial: 'At least 1 special character',
  submit: 'Login',
  backToLogin: '← Return to the login screen',
} as const
