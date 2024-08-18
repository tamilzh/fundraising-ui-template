module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: ["commitlint-plugin-function-rules"],
  rules: {
    "type-enum": [0], // level: disabled
    "function-rules/type-enum": [
      2, // level: error
      "always",
      (parsed) => {
        const types = ["bug", "feature", "release", "fix"];

        if (parsed.type && types.some((type) => parsed.type.startsWith(type))) {
          return [true];
        }

        return [false, `type must be one of [${types.join(", ")}] \n example try -> bug: issue #123 fixing bug or feature: issue #123 fixing feature`];
      },
    ],
    "subject-empty": [0], // 1 2 level: disabled
    "function-rules/subject-empty": [
      2, // level: error
      "always",
      (parsed) => {
        const regex = new RegExp("^issue #[0-9]");

        if (parsed.subject && regex.test(parsed.subject)) {
          return [true];
        }

        return [
          false,
          `subject should be in the format \'issue #<id> <description>\' \n example try -> bug: issue #123 fixing bug`,
        ];
      },
    ],
  },
};
