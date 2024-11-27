const path = require("path")

module.exports = {
	"parser": "@typescript-eslint/parser",
	"extends": [
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:prettier/recommended",
		"plugin:react/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"plugin:react/jsx-runtime",
		"prettier"
	],
	"plugins": [
		"@marcapo",
		"@typescript-eslint",
		"prefer-arrow"
	],
	"parserOptions": {
		"project": path.join(__dirname, "tsconfig.json"),
		"sourceType": "module",
		"ecmaVersion": 2018
	},
	"ignorePatterns": [
		"setupProxy.js",
		".eslintrc.cjs"
	],
	"rules": {
		"@marcapo/init-class-member": "error",
		"import/no-unresolved": "off",
		"import/named": "off",
		"import/no-default-export": "error",
		"prettier/prettier": "error",
		"@typescript-eslint/unbound-method": "warn",
		"prefer-template": "error",
		"no-useless-concat": "error",
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				"checksVoidReturn": {
					"attributes": false
				}
			}
		],
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/prefer-optional-chain": "error",
		"@typescript-eslint/adjacent-overload-signatures": "error",
		"@typescript-eslint/array-type": "error",
		"@typescript-eslint/ban-types": "error",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				"selector": "class",
				"format": [
					"PascalCase"
				]
			},
			{
				"selector": "interface",
				"format": [
					"PascalCase"
				],
				"custom": {
					"regex": "^I[A-Z]",
					"match": true
				}
			}
		],
		"@typescript-eslint/consistent-type-assertions": "error",
		"@typescript-eslint/consistent-type-definitions": "error",
		"@typescript-eslint/explicit-member-accessibility": [
			"error",
			{
				"accessibility": "explicit",
				"overrides": {
					"accessors": "no-public",
					"constructors": "no-public",
					"methods": "explicit",
					"properties": "explicit",
					"parameterProperties": "explicit"
				}
			}
		],
		"@typescript-eslint/indent": "off",
		"@typescript-eslint/member-delimiter-style": [
			"off",
			{
				"multiline": {
					"delimiter": "none",
					"requireLast": true
				},
				"singleline": {
					"delimiter": "semi",
					"requireLast": false
				}
			}
		],
		"react/display-name": "off",
		"react/prop-types": "off",
		"@typescript-eslint/member-ordering": "off",
		"@typescript-eslint/no-unsafe-member-access": "warn",
		"@typescript-eslint/no-unsafe-argument": "warn",
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-unsafe-call": "warn",
		"@typescript-eslint/no-empty-function": "error",
		"@typescript-eslint/no-empty-interface": "error",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-misused-new": "error",
		"@typescript-eslint/no-namespace": "error",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/prefer-for-of": "error",
		"@typescript-eslint/prefer-function-type": "error",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/ban-ts-comment": "warn",
		"@typescript-eslint/prefer-namespace-keyword": "error",
		"@typescript-eslint/quotes": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/semi": [
			"off",
			null
		],
		"@typescript-eslint/triple-slash-reference": "error",
		"@typescript-eslint/type-annotation-spacing": "off",
		"@typescript-eslint/unified-signatures": "error",
		"arrow-body-style": "error",
		"arrow-parens": [
			"off",
			"as-needed"
		],
		"camelcase": "off",
		"comma-dangle": "off",
		"complexity": "off",
		"constructor-super": "error",
		"curly": "error",
		"dot-notation": "error",
		"eol-last": "off",
		"eqeqeq": [
			"error",
			"smart"
		],
		"guard-for-in": "error",
		"id-blacklist": [
			"error",
			"any",
			"string",
			"boolean",
			"Undefined"
		],
		"id-match": "error",
		"import/order": "error",
		"linebreak-style": "off",
		"max-classes-per-file": [
			"error",
			1
		],
		"max-len": "off",
		"new-parens": "off",
		"newline-per-chained-call": "off",
		"no-bitwise": "error",
		"no-caller": "error",
		"no-cond-assign": "error",
		"no-console": "off",
		"no-debugger": "error",
		"no-empty": "error",
		"no-eval": "error",
		"no-extra-semi": "off",
		"no-fallthrough": "off",
		"no-invalid-this": "off",
		"no-irregular-whitespace": "off",
		"no-multiple-empty-lines": "off",
		"no-new-wrappers": "error",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": [
			"error"
		],
		"no-throw-literal": "error",
		"no-trailing-spaces": "off",
		"no-undef-init": "error",
		"no-underscore-dangle": "off",
		"no-unsafe-finally": "error",
		"no-unused-expressions": "error",
		"no-unused-labels": "error",
		"no-var": "error",
		"object-shorthand": "error",
		"one-var": [
			"error",
			"never"
		],
		"prefer-arrow/prefer-arrow-functions": "error",
		"prefer-const": "error",
		"quote-props": "off",
		"radix": "error",
		"space-before-function-paren": "off",
		"space-in-parens": [
			"off",
			"never"
		],
		"spaced-comment": "error",
		"use-isnan": "error",
		"valid-typeof": "off"
	},
	"overrides": [
		{
			"files": [
				"./pages/_app.tsx",
				"index.tsx",
				"./pages/_document.tsx",
				"./pages/_error.tsx"
			],
			"rules": {
				"import/no-default-export": "off"
			}
		},
		{
			"files": [
				"./src/react-app-env.d.ts"
			],
			"rules": {
				"spaced-comment": "off"
			}
		}
	],
	"settings": {
		"react": {
			"version": "detect"
		}
	}
}