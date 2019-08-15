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

  await exec.exec('rustup', ['update']);
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
    // TODO: Fix this
    // It currently fails with:
    // error: 'rustup-init.exe' is not installed for the toolchain 'stable-x86_64-pc-windows-msvc'
    await io.cp(script, script + '.exe');
    script += '.exe';

    const powershell = await io.which('powershell', true);

    await exec.exec(
      `"${script}"`,
      [
        '--default-host',
        'gnu',
        '--default-toolchain',
        version,
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
    return "https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-gnu/rustup-init.exe"
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
