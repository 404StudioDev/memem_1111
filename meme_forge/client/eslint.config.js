import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: pluginReact
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off" // Not needed in React 17+
    }
  }
]);
