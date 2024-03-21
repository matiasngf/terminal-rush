module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@terminal-rush/eslint-config-custom`
  extends: [
    "@terminal-rush/eslint-config-custom"
  ],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
  rules: {
    "jsx-a11y/alt-text": "off",
  }
};
