/**
 * Central mock + domain data for the Login (set new password) screen
 * (Figma 6onmzfI4xa8wloQEAyjQ5b — node 2281:147).
 */
export const loginData = {
  valid: {
    title: 'Set your new password',
    passwordMeetsAll: 'Aa1!aaaa',
    passwordPartial: 'Abcdefgh',
  },
  invalid: {
    emailLike: 'not-an-email',
  },
  edge: {
    xssLike: "<script>alert(1)</script>!Aa1",
    longPassword: 'Aa1!'.padEnd(256, 'x'),
  },
  api: {
    healthPath: '**/api/health',
    listSuccess: [{ id: '1', name: 'ok' }],
    errorMessage: 'Request failed',
  },
} as const

export const brandCopy = {
  title: 'Track, Schedule, and Optimize Your Pool Services',
} as const
