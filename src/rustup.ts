import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as toolCache from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';
import {chmodSync} from 'fs';

let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

export async function install() {
  // `rustup` is already installed in
  if (os.platform() == 'darwin') {
    let toolPath = await installOnUnix();

    core.debug('rustup is located under: ' + toolPath);
    core.addPath(path.join(toolPath, 'bin'));
  }
}

async function installOnUnix(): Promise<string> {
  let script = await toolCache.downloadTool("https://sh.rustup.rs");

  chmodSync(script, '777');
  await exec.exec(`"${script}"`, ['-y', '--default-toolchain', 'none']);

  return path.join(process.env['HOME'] || '', '.cargo');
}
