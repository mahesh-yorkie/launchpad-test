const MIN_LEN = 8;
const UPPER = /[A-Z]/;
const NUM = /[0-9]/;
const SPECIAL = /[^A-Za-z0-9]/;

export type RuleKey = "length" | "upper" | "number" | "special";

export type RuleStatus = "pending" | "pass" | "fail";

export function getPasswordRuleStates(password: string): Record<RuleKey, RuleStatus> {
  if (!password) {
    return { length: "pending", upper: "pending", number: "pending", special: "pending" };
  }
  return {
    length: password.length >= MIN_LEN ? "pass" : "fail",
    upper: UPPER.test(password) ? "pass" : "fail",
    number: NUM.test(password) ? "pass" : "fail",
    special: SPECIAL.test(password) ? "pass" : "fail",
  };
}

export function allRulesPass(password: string): boolean {
  const s = getPasswordRuleStates(password);
  return s.length === "pass" && s.upper === "pass" && s.number === "pass" && s.special === "pass";
}
