import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as toolCache from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';
import {chmodSync, rename} from 'fs';
import {promisify} from 'util';

let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
const renameAsync = promisify(rename);

export async function install() {
  // `rustup` is already installed on Linux and Windows platforms
  if (os.platform() == 'darwin') {
    let toolPath = await installOnUnix();

    core.debug('rustup is located under: ' + toolPath);
    core.addPath(path.join(toolPath, 'bin'));
  } else {
    // Update the GitHub managed VM version of rustup
    // to leverage newer features like "latest latest compatible nightly"
    await exec.exec('rustup', ['self', 'update']);

    await exec.exec('rustup', ['set', 'profile', 'minimal']);

    if (os.platform() == 'win32') {
      let rustDocsInstalled = false;
      {
        let installedComponents = '';
        const options = {
          listeners: {
            stdout: (data: Buffer) => {
              installedComponents += data.toString();
            }
          }
        };
        await exec.exec('rustup', ['component', 'list'], options);
        rustDocsInstalled = installedComponents.match(/rust-docs.+\(installed\)/) != null;
      }

      if (rustDocsInstalled) {
        let cargoPath = '';
        {
          const options = {
            listeners: {
              stdout: (data: Buffer) => {
                cargoPath += data.toString();
              }
            }
          };
          await exec.exec('where', ['rustup.exe'], options);
        }
        let rustupPath = cargoPath.split('\\').slice(0, -3).concat([".rustup"]).join("\\");
        // Github's default Windows install comes with rustup pre-installed with stable, including
        // rust-docs. This removes the default stable install so that it doesn't update rust-docs.
        await renameAsync(`${rustupPath}\\toolchains`, `${rustupPath}\\_toolchains`);
      }
    }
  }
}

async function installOnUnix(): Promise<string> {
  let script = await toolCache.downloadTool("https://sh.rustup.rs");

  chmodSync(script, '777');
  await exec.exec(`"${script}"`, ['-y', '--default-toolchain', 'none', '--profile=minimal']);

  return path.join(process.env['HOME'] || '', '.cargo');
}
