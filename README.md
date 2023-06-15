# Setup Rust

🦀 Setup the Rust toolchain for GitHub Actions

<div align="center">

![](https://picsum.photos/600/400)

</div>

0️⃣ Zero-config &mdash; sensible defaults! \
📦 Installs Rust using the `rustup` toolchain manager \
🧰 Customizable with input options


## Usage

![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)

The easiest way to get started is to just plonk the following in your workflow:

```yml
- uses: jcbhmr/setup-rust-action
```

<details><summary>📄 Full <code>cargo test</code> example</summary>

```yml
on: push
jobs:
  test-cargo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: jcbhmr/setup-rust-action@v1
      - run: cargo test
```

</details>

This will use the latest stable version of Rust and install everything that the
normal `rustup` installer would. 😎 If you prefer a more minimal installation,
you can use the `minimal` profile:

```yml
- uses: jcbhmr/setup-rust-action@v1
  with:
    profile: minimal
```

### Inputs

- **`toolchain-version`:** Which version of the Rust toolchain to install. You
  can choose from `stable`, `beta`, `nightly`, or a specific version number.
  This is passed to the `rustup toolchain install` command. Default is `stable`.

- **`profile`:** Which profile to use for the Rust toolchain. You can choose
  from `default`, `minimal`, or `complete`. This is passed to the installation
  command. Default is `default`.

- **`component`:** Alias for `components`.

- **`components`:** Which components to install for the Rust toolchain.
  There`s so many! The highlights are `rustfmt`, `clippy`, and `rust-analysis`.
  This is passed to the installation command. Default is empty (use profile
  defaults).

- **`target`:** Alias for `targets`.

- **`targets`:** Which targets to install for the Rust toolchain. Choose any
  valid target triple like `x86_64-unknown-linux-gnu` or
  `wasm32-unknown-unknown`. This is passed as the `--target` flag when
  installing the Rust toolchain. The default is empty (use current platform).

### Outputs

- **`rustup_version`:** The version of rustup that was installed. This is the
  output of the `rustup --version` command.

- **`cargo_version`:** The version of cargo that was installed. This is the
  output of the `cargo --version` command.

- **`rustc_version`:** The version of rustc that was installed. This is the
  output of the `rustc --version` command.
