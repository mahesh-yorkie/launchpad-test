export const signInData = {
  valid: {
    email: "john.doe@testmail.com",
    password: "Secret!9a",
  },
  invalid: {
    email: "not-an-email",
    password: "short",
  },
  edge: {
    plusEmail: "current+tag@example.com",
    whitespaceOnly: "      ",
    longPassword: `Aa1!${"z".repeat(200)}`,
  },
  api: {
    successBody: { token: "session-token" },
    errorMessage: "Invalid credentials",
    rateLimitMessage: "Too many attempts",
  },
} as const;
