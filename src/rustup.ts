import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as toolCache from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';
import {chmodSync} from 'fs';

let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

export async function install(version: string) {
  if (os.platform() == 'darwin') {
    let toolPath = await acquireRust(version);

    core.debug('Rust toolchain is cached under ' + toolPath);

    core.addPath(path.join(toolPath, 'bin'));
  }
}

async function acquireRust(version: string): Promise<string> {
  let script: string;

  try {
    script = await toolCache.downloadTool("https://sh.rustup.rs");
  } catch (error) {
    core.debug(error);
    throw `Failed to download rustup: ${error}`;
  }

  chmodSync(script, '777');
  await exec.exec(`"${script}"`, ['-y', '--default-toolchain', 'none']);

  let cargo = path.join(process.env['HOME'] || '', '.cargo');

  return await toolCache.cacheDir(cargo, 'rust', version);
}
