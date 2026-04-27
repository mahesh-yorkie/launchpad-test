import { describe, expect, it } from 'vitest'

import {
  getLastForgotPasswordEmail,
  getLastSetPasswordSubmission,
  recordForgotPasswordEmail,
  recordSetPasswordSubmission,
  resetAuthStore,
} from '@/mocks/store/auth-store'

describe('auth store', () => {
  it('starts with no recorded submission', () => {
    resetAuthStore()
    expect(getLastSetPasswordSubmission()).toBeNull()
  })

  it('records the latest submission payload', () => {
    resetAuthStore()
    recordSetPasswordSubmission({
      password: 'AndrewSalgado@2024',
      confirmPassword: 'AndrewSalgado@2024',
    })

    expect(getLastSetPasswordSubmission()?.password).toBe('AndrewSalgado@2024')
  })

  it('clears submissions when resetAuthStore runs', () => {
    recordSetPasswordSubmission({
      password: 'AndrewSalgado@2024',
      confirmPassword: 'AndrewSalgado@2024',
    })
    resetAuthStore()

    expect(getLastSetPasswordSubmission()).toBeNull()
  })

  it('records the latest forgot-password email independently', () => {
    resetAuthStore()
    recordForgotPasswordEmail('john.doe@testmail.com')

    expect(getLastForgotPasswordEmail()).toBe('john.doe@testmail.com')
  })

  it('clears forgot-password email when resetAuthStore runs', () => {
    recordForgotPasswordEmail('john.doe@testmail.com')
    resetAuthStore()

    expect(getLastForgotPasswordEmail()).toBeNull()
  })
})
