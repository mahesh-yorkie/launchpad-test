export const loginData = {
  valid: {
    email: "john.doe@testmail.com",
    password: "Test@1234!",
  },
  invalid: {
    email: "not-an-email",
    password: "x",
  },
  edge: {
    longName: "A".repeat(500),
    unicodeEmail: "héllo@wörld.example",
    whitespaceOnly: "    ",
    xssLike: "<script>alert(1)</script>",
  },
  api: {
    successBody: { success: true, token: "test-token" },
    errorMessage: "Request failed",
  },
} as const;
