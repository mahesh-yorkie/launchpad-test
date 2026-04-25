export const loginData = {
  valid: {
    password: "Abcdef1!",
    confirmPassword: "Abcdef1!",
  },
  invalid: {
    tooShort: "Abc1!",
    notMatching: { password: "Abcdef1!", confirmPassword: "Abcdef2!" },
  },
  edge: {
    longName: "Aa1!".padEnd(500, "a"),
    unicode: "Abcdeñ1!ß",
    whitespaceOnly: "    ",
    xssLike: "<script>alert(1)</script>",
  },
  api: {
    successBody: { success: true },
    errorMessage: "Request failed",
  },
} as const;
