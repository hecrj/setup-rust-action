# setup-rust-action

[![Integration test status](https://github.com/hecrj/setup-rust-action/workflows/Integration%20test/badge.svg)](https://github.com/hecrj/setup-rust-action/actions)

Sets up a specific Rust toolchain for use in your GitHub Actions workflows.

# Usage

Provide a `rust-version` with the desired toolchain version to install.

You can combine it with `matrix` to test different Rust toolchains in different
platforms!

```yml
name: Test
on: [push]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
        rust: [stable, nightly]

    steps:
    - uses: hecrj/setup-rust-action@master
      with:
        rust-version: ${{ matrix.rust }}
    - uses: actions/checkout@master
    - name: Run tests
      run: cargo test --verbose
```

For more details, check out [`action.yml`].

[`action.yml`]: https://github.com/hecrj/setup-rust-action/blob/master/action.yml

# Contributing / Feedback

Contributions and feedback are welcome! Feel free to open any issues or pull
requests.
