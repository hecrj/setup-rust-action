import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as toolCache from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';
import {chmodSync} from 'fs';

let osPlat: string = os.platform();
let osArch: string = os.arch();
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
const WINDOWS: boolean = osPlat == 'win32';

export async function install(version: string) {
  let toolPath = toolCache.find('rust', version);

  if (!toolPath) {
    toolPath = await acquireRust(version);
    core.debug('Rust toolchain is cached under ' + toolPath);
  }

  toolPath = path.join(toolPath, 'bin');
  core.addPath(toolPath);
}

async function acquireRust(version: string): Promise<string> {
  let script: string;

  try {
    script = await toolCache.downloadTool(rustupUrl());
  } catch (error) {
    core.debug(error);
    throw `Failed to download rustup: ${error}`;
  }

  if(WINDOWS) {
    await io.cp(script, script + '.exe');
    script += '.exe';

    console.log(await io.which('rustup', true));

    await exec.exec(
      `"${script}"`,
      [
        '-y',
        '--default-toolchain',
        'none',
      ]
    );
  } else {
    chmodSync(script, '777');

    await exec.exec(`"${script}"`, ['-y', '--default-toolchain', version]);
  }

  return await toolCache.cacheDir(binRoot(), 'rust', version);
}

function rustupUrl(): string {
  if(WINDOWS) {
    return "https://win.rustup.rs"
  } else {
    return "https://sh.rustup.rs"
  }
}

function binRoot(): string {
  if(WINDOWS) {
    return path.join(process.env['USERPROFILE'] || '', '.cargo');
  } else {
    return path.join(process.env['HOME'] || '', '.cargo');
  }
}
