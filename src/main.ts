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
    const targets = core.getInput('targets')
      .split(',')
      .map((target) => target.trim())
      .filter((target) => target.length > 0);

    if(version) {
      await rustup.install();
      if (os.platform() !== 'darwin') {
        // update the GitHub managed VM version of rustup
        // to leverage newer features like "latest latest compatible nightly"
        await exec.exec('rustup', ['self', 'update']);
      }
      await exec.exec('rustup', ['default', version]);
      await exec.exec('rustup', ['update', version]);

      for(let component of components) {
        await exec.exec('rustup', ['component', 'add', component]);
      }

      for(let target of targets) {
        await exec.exec('rustup', ['target', 'add', target]);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
