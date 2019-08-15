import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as rustup from './rustup';
import * as os from 'os';

async function run() {
  try {
    const version = core.getInput('rust-version');

    if(version) {
      await rustup.install(version);

      exec.exec('rustup', ['default', version]);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
