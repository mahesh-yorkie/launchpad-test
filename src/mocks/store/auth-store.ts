export type SetPasswordPayload = {
  password: string
  confirmPassword: string
}

let lastSubmission: SetPasswordPayload | null = null

export function getLastSetPasswordSubmission() {
  return lastSubmission
}

export function recordSetPasswordSubmission(payload: SetPasswordPayload) {
  lastSubmission = payload
}

export function resetAuthStore() {
  lastSubmission = null
}
