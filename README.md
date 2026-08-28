> ## ⚠️ DEPRECATED — moved to [yingyeothon/tslib](https://github.com/yingyeothon/tslib)
>
> This repository is archived and no longer maintained. Its packages now live in the
> `tslib` monorepo and are published from there as **v2.0.0+** with a redesigned API
> (see each package's README there for migration notes).
>
> | Package here (last release from this repo) | Successor in `tslib` |
> | --- | --- |
> | `@yingyeothon/codec` | `@yingyeothon/codec` |
> | `@yingyeothon/event-broker` | `@yingyeothon/event-broker` |
> | `@yingyeothon/logger` | `@yingyeothon/logger` |
> | `@yingyeothon/logger-s3` | `@yingyeothon/logger-s3` |
>
> Versions published from this repository stay on npm but are marked deprecated.

# NodeJS Toolkit for Yingyeothon

A bundle of small libraries for [yingyeothon](https://yyt.life)'s infrastructure.

## List-up

Many of things would be deployed to [npmjs](https://www.npmjs.com/org/yingyeothon).

- [Logger](packages/logger)
- [LoggerS3](packages/logger-s3)
- [Event broker](packages/event-broker)
- [Codec](packages/codec)

## Development

It uses `pnpm` for monorepo.

### Create a new

- Execute `create` command and copy `tsconfig.json` file from any other project.

```bash
mkdir -p packages/new-package
cd packages/new-package
pnpm init
cp ../codec/tsconfig.json .
ln -s ../../.eslint* .
cp ../../jest.config.js .
cp -r ../../.vscode .
```

- Fill `package.json` file referencing any other project. Should fill up `typings`, `publishConfig` and `scripts.[build, test]`.

### Write a code and build

Please use `pnpm build` in the specific package directory.

### Test

Write some test codes that import a library from JavaScript that built by `tsc`. Run `pnpm test`.

### Publish

- Check if its `README.md` is proper.
- Check if it can build to JavaScript properly.
- Check if it passes all tests we write.
- Check the version of this package.
- `pnpm publish`.

## License

MIT
