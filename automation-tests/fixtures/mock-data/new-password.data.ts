export const newPasswordData = {
  valid: {
    password: "Abcdefgh",
    meetAllRules: "Abc@1234",
  },
  invalid: {
    tooShort: "a",
    notEmail: "not-an-email",
  },
  edge: {
    longPassword: "A".repeat(200),
    unicode: "Café@1234",
    whitespace: "   ",
  },
  api: {
    putSuccess: { status: 204, body: "" as string | undefined },
    errorMessage: "Password update failed",
  },
} as const;
