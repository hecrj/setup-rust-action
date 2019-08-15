import * as core from '@actions/core';
import * as rustup from './rustup';
import * as os from 'os';

async function run() {
  try {
    const version = core.getInput('rust-version');

    if(version && os.platform() != 'win32') {
      await rustup.install(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
