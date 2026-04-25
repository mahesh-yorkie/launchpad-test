export const newPasswordData = {
  valid: {
    password: "ValidPass1!",
    confirm: "ValidPass1!",
  },
  invalid: {
    tooShort: "Ab1!",
    noUpper: "validpass1!",
    noNumber: "ValidPass!!",
    noSpecial: "ValidPass1a",
  },
  edge: {
    longPassword: "Aa1!".padEnd(500, "x"),
    unicode: "Müstér1!한",
    whitespaceOnly: "   ",
    xssLike: "<script>alert(1)</script>Aa1!",
  },
  api: {
    newPasswordPath: "http://localhost:5000/api/auth/new-password",
    successMessage: { ok: true },
    errorMessage: { message: "Request failed" },
  },
} as const;
