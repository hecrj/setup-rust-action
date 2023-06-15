#!/bin/bash
set -e
if [[ -n $RUNNER_DEBUG ]]; then
  set -x
fi

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- \
  -y --default-toolchain none --profile minimal
echo "$HOME/.cargo/bin" >>"$GITHUB_PATH"

components=${INPUT_COMPONENTS:-$INPUT_COMPONENT}
targets=${INPUT_TARGETS:-$INPUT_TARGET}
args=()
[[ -n $components ]] && args+=(-c $components)
[[ -n $targets ]] && args+=(-t $targets)
rustup toolchain install "$INPUT_TOOLCHAIN_VERSION" \
  --profile "$INPUT_PROFILE" "${args[@]}"

echo "rustup_version=$(rustup --version)" >>"$GITHUB_OUTPUT"
echo "cargo_version=$(cargo --version)" >>"$GITHUB_OUTPUT"
echo "rustc_version=$(rustc --version)" >>"$GITHUB_OUTPUT"
echo "::add-matcher::rust-matcher.json"