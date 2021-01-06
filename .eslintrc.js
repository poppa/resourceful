module.exports = {
  // Specifies the ESLint parser
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    // Uses eslint-config-prettier to disable ESLint rules from
    // @typescript-eslint/eslint-plugin that would conflict with prettier
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2019,
    // Allows for the use of imports
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // *************************************************************************
    // Pure eslint
    // *************************************************************************
    'no-unused-vars': 'off',
    curly: 'error',
    yoda: 'error',
    'default-case': 'error',
    camelcase: 'off',
    eqeqeq: ['error', 'always'],
    'no-case-declarations': 'error',
    'no-new-wrappers': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-useless-call': 'error',
    'require-atomic-updates': 'error',
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    // *************************************************************************
    // @typescript-eslint
    // *************************************************************************
    '@typescript-eslint/naming-convention': [
      'error',
      // --------------
      // typeParameter
      // --------------
      { selector: 'typeParameter', format: ['PascalCase'] },

      // ---------
      // parameter
      // ---------
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      // ---------
      // interface
      // ---------
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },

      // ------------------
      // variable, function
      // ------------------
      {
        selector: ['variable', 'function'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      // --------------------
      // typeLike, enumMember
      // --------------------
      {
        selector: ['typeLike', 'enumMember'],
        format: ['StrictPascalCase'],
      },

      // ------------------
      // property (default)
      // ------------------
      {
        selector: 'property',
        format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },

      // -------------------
      // accessor (public)
      // -------------------
      {
        selector: 'accessor',
        modifiers: ['public'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },

      // -------------------------------
      // property (private)
      // -------------------------------
      {
        selector: 'property',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      // -------------------------------
      // property (protected)
      // -------------------------------
      {
        selector: 'property',
        modifiers: ['protected'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      // -------------------
      // property (static)
      // -------------------
      {
        selector: 'property',
        modifiers: ['public', 'static'],
        format: ['strictCamelCase', 'StrictPascalCase'],
      },

      // ---------------
      // method (public)
      // ---------------
      {
        selector: ['method'],
        modifiers: ['public'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
    ],
    // ---------
    // no-shadow
    // ---------
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // --------------------
    // no-use-before-define
    // --------------------
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],

    // -----------------------------
    // explicit-member-accessibility
    // -----------------------------
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { ignoredMethodNames: ['constructor'] },
    ],

    // --------------------------------------------------
    // Conflicts with explicit-function-return-type below
    // --------------------------------------------------
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // -----------------------------
    // explicit-function-return-type
    // -----------------------------
    '@typescript-eslint/explicit-function-return-type': ['error'],

    // --------------
    // no-unused-vars
    // --------------
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],

    // ----------
    // array-type
    // ----------
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

    // -----------------
    // no-empty-function
    // -----------------
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: [
          'private-constructors',
          'protected-constructors',
          'decoratedFunctions',
        ],
      },
    ],

    // --------------------------
    // consistent-type-assertions
    // --------------------------
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter',
      },
    ],

    // -------------------------------
    // consistent-indexed-object-style
    // -------------------------------
    '@typescript-eslint/consistent-indexed-object-style': 'error',

    // ---------------
    // keyword-spacing
    // ---------------
    'keyword-spacing': 'off',
    '@typescript-eslint/keyword-spacing': ['error'],

    // ----------------------
    // member-delimiter-style
    // ----------------------
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],

    // -----------
    // brace-style
    // -----------
    // 'brace-style': 'off',
    // '@typescript-eslint/brace-style': ['error'],

    // -------------
    // comma-spacing
    // -------------
    'comma-spacing': 'off',
    '@typescript-eslint/comma-spacing': ['error'],

    // consistent-type-imports
    '@typescript-eslint/consistent-type-imports': ['error'],

    // -----------------
    // func-call-spacing
    // -----------------
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': ['error'],

    // -------------------
    // no-extraneous-class
    // -------------------
    '@typescript-eslint/no-extraneous-class': ['error'],

    // ---------------------
    // no-implicit-any-catch
    // ---------------------
    '@typescript-eslint/no-implicit-any-catch': ['error'],

    // ---------------
    // no-invalid-this
    // ---------------
    'no-invalid-this': 'off',
    '@typescript-eslint/no-invalid-this': ['error'],

    // --------------------
    // no-loss-of-precision
    // --------------------
    'no-loss-of-precision': 'off',
    '@typescript-eslint/no-loss-of-precision': ['error'],

    // ------------
    // no-redeclare
    // ------------
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],

    // ------
    // quotes
    // ------
    quotes: 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      { allowTemplateLiterals: true, avoidEscape: true },
    ],

    // ----
    // semi
    // ----
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],

    // ---------------
    // prefer-as-const
    // ---------------
    '@typescript-eslint/prefer-as-const': ['error'],

    // --------------------
    // prefer-function-type
    // --------------------
    '@typescript-eslint/prefer-function-type': ['error'],

    // ---------------------
    // prefer-optional-chain
    // ---------------------
    '@typescript-eslint/prefer-optional-chain': ['error'],

    // --------------------------
    // prefer-literal-enum-member
    // --------------------------
    '@typescript-eslint/prefer-literal-enum-member': ['error'],

    // ----------------------
    // prefer-ts-expect-error
    // ----------------------
    '@typescript-eslint/prefer-ts-expect-error': ['error'],

    // -----------------------
    // type-annotation-spacing
    // -----------------------
    '@typescript-eslint/type-annotation-spacing': ['error'],

    // ---------------------------
    // space-before-function-paren
    // ---------------------------
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],

    // ----------------------------
    // adjacent-overload-signatures
    // ----------------------------
    '@typescript-eslint/adjacent-overload-signatures': ['error'],

    // ----------------------------
    // class-literal-property-style
    // ----------------------------
    '@typescript-eslint/class-literal-property-style': ['error'],

    // Requires parserOptions.project
    '@typescript-eslint/switch-exhaustiveness-check': ['error'],
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/restrict-plus-operands': ['error'],
    '@typescript-eslint/require-array-sort-compare': ['error'],
    '@typescript-eslint/prefer-readonly': ['error'],
    '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
    // '@typescript-eslint/prefer-readonly-parameter-types': ['error'],
    '@typescript-eslint/prefer-nullish-coalescing': ['error'],
    '@typescript-eslint/unbound-method': [
      'error',
      {
        ignoreStatic: true,
      },
    ],
    'react/prop-types': ['off'],
  },
}
