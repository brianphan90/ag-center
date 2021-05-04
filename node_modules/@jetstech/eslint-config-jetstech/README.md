# eslint-config-jetstech

This package uses ESLint to enforce JETS Tech's code style
and provides a shared base configuration for our JavaScript
projects.

We have other configurations that we primarily use that
extend this base, listed below:

> `eslint-config-jetstech/vue` - Provides extended rules
> for JETS Tech Vue projects.

## Install

### `yarn`

```bash
yarn add -D @jetstech/eslint-config-jetstech eslint
```

### `npm`

```bash
npm i -D @jetstech/eslint-config-jetstech eslint
```

## Usage

### NodeJS

Add `"extends": "@jetstech/eslint-config-jetstech"` to your `.eslintrc`.

### VueJS

Add `"extends": "@jetstech/eslint-config-jetstech/vue"` to
your `.eslintrc`.
