export const forgotPasswordData = {
  valid: {
    email: "john.doe@testmail.com",
  },
  invalid: {
    email: "not-an-email",
    missingDomain: "user@",
  },
  edge: {
    plusTag: "current+tag@example.com",
    whitespaceOnly: "      ",
    longLocal: `${"a".repeat(120)}@example.com`,
    xssLike: '<script>alert(1)</script>@test.com',
  },
  api: {
    successBody: { ok: true },
    errorMessage: "Unable to send reset email",
    rateLimitMessage: "Too many requests",
  },
} as const;
