# setup-rust-action

[![Integration status](https://github.com/hecrj/setup-rust-action/workflows/Integration/badge.svg)](https://github.com/hecrj/setup-rust-action/actions)

Sets up a specific Rust toolchain for use in your GitHub Actions workflows.

# Usage

Provide a `rust-version` with the desired toolchain version to install.

You can combine it with `matrix` to test different Rust toolchains in different platforms!

```yml
name: Test Rust project
on: [push]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
        rust: [stable, nightly]

    steps:
    - uses: hecrj/setup-rust-action@v1
      with:
        rust-version: ${{ matrix.rust }}
    - uses: actions/checkout@master
    - name: Run tests
      run: cargo test --verbose
```

## Inputs

The following inputs can be provided with the `jobs.<job_id>.steps.with` yaml key.

| Name         | Required | Description                                            | Type                    | Default |
|--------------|:--------:|--------------------------------------------------------|-------------------------|---------|
| rust-version | ✖        | The toolchain name, such as stable, nightly, or 1.8.0  | String                  | stable  |
| components   | ✖        | The toolchain components to install                    | String, comma-separated |         |
| targets      | ✖        | The toolchain targets to add                           | String, comma-separated |         |

For more details, check out [`action.yml`].

[`action.yml`]: https://github.com/hecrj/setup-rust-action/blob/master/action.yml


## Problem Matchers

This action registers the following [problem matchers](https://github.com/actions/toolkit/blob/master/docs/problem-matchers.md) to surface relevant information inline with changeset diffs.

* `cargo-common` matches common cases of errors and warnings
* `cargo-test` matches cargo test errors
* `cargo-fmt` matches rust format errors

To disable any or all of these you can use the `remove-matcher` directive documented [here](https://github.com/actions/toolkit/blob/master/docs/commands.md#problem-matchers).

# Contributing / Feedback

Contributions and feedback are welcome! Feel free to open any issues or pull requests.
