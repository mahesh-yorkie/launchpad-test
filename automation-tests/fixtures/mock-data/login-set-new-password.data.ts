export const loginSetNewPasswordData = {
  valid: {
    password: "Current!Pass9",
    confirmPassword: "Current!Pass9",
  },
  invalid: {
    weakPassword: "short",
    mismatchedConfirm: "Current!Pass9",
    wrongConfirm: "Current!Pass8",
  },
  edge: {
    longPassword: `Aa1!${"z".repeat(240)}`,
    unicodePassword: "München9!Strong",
    whitespaceOnly: "      ",
    xssLike: '<script>alert(1)</script>Aa9!',
  },
  api: {
    successBody: { ok: true },
    errorMessage: "Unable to update password",
    conflictMessage: "Password already used",
  },
} as const;
