export type SetPasswordPayload = {
  password: string
  confirmPassword: string
}

let lastSubmission: SetPasswordPayload | null = null
let lastForgotPasswordEmail: string | null = null
let lastLoginEmail: string | null = null

export function getLastSetPasswordSubmission() {
  return lastSubmission
}

export function recordSetPasswordSubmission(payload: SetPasswordPayload) {
  lastSubmission = payload
}

export function getLastForgotPasswordEmail() {
  return lastForgotPasswordEmail
}

export function recordForgotPasswordEmail(email: string) {
  lastForgotPasswordEmail = email
}

export function getLastLoginEmail() {
  return lastLoginEmail
}

export function recordLoginEmail(email: string) {
  lastLoginEmail = email
}

export function resetAuthStore() {
  lastSubmission = null
  lastForgotPasswordEmail = null
  lastLoginEmail = null
}
