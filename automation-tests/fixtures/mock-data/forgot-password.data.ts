export const forgotPasswordData = {
  valid: {
    email: "alex.mora@example.com",
  },
  invalid: {
    email: "not-an-email",
  },
  edge: {
    longLocal: "a".repeat(200) + "@x.co",
  },
  api: {
    successBody: { ok: true, sent: true },
    errorMessage: "Request failed",
  },
} as const;
