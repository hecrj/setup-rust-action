import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as rustup from './rustup';
import * as os from 'os';

async function run() {
  try {
    const version = core.getInput('rust-version');
    const components = core.getInput('components')
      .split(',')
      .map((component) => component.trim())
      .filter((component) => component.length > 0);

    if(version) {
      await rustup.install();
      await exec.exec('rustup', ['default', version]);
      await exec.exec('rustup', ['update', version]);

      for(let component of components) {
        await exec.exec('rustup', ['component', 'add', component]);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
