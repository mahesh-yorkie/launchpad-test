import { AUTH_BRANDING_COPY } from '@/const/auth-branding'

export const FORGOT_PASSWORD_COPY = {
  ...AUTH_BRANDING_COPY,
  title: 'Forgot your password',
  description:
    'Please enter your email address below to initiate the password reset process.',
  emailLabel: 'Email',
  emailPlaceholder: 'alexmora@gmail.com',
  submit: 'Confirm',
  backToLogin: 'Return to the login screen',
} as const
