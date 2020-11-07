import * as exec from "@actions/exec";
import * as core from "@actions/core";

interface Version {
  long: string;
  hash: string | null;
}

function parse(stdout: string): Version | null {
  const regex = /\S+\s((\S+)\s\((?:(\S+)\s)?(\S+)\))/m;
  stdout = stdout.trim();
  const matches = regex.exec(stdout);

  if (matches) {
    return {
      long: matches[1],
      hash: matches[3],
    };
  }
  core.warning(`Unable to determine version from the "${stdout}" string`);
  return null;
}

async function getStdout(exe: string, args: string[]): Promise<string> {
  let stdout = "";
  const options = {
    listeners: {
      stdout: (buffer: Buffer): void => {
        stdout += buffer.toString();
      },
    },
  };

  await exec.exec(exe, args, options);

  return stdout;
}

async function rustc(): Promise<void> {
  const stdout = await getStdout("rustc", ["-V"]);
  const version = parse(stdout);

  if (version) {
    core.setOutput("rustc", version.long);
    if (version.hash) {
      core.setOutput("rustc_hash", version.hash);
    }
  }
}

async function cargo(): Promise<void> {
  const stdout = await getStdout("cargo", ["-V"]);
  const version = parse(stdout);

  if (version) {
    core.setOutput("cargo", version.long);
  }
}

async function rustup(): Promise<void> {
  const stdout = await getStdout("rustup", ["-V"]);
  const version = parse(stdout);

  if (version) {
    core.setOutput("rustup", version.long);
  }
}

export async function gatherInstalledVersions(): Promise<void> {
  try {
    core.startGroup("Gathering installed versions");

    await rustc();
    await cargo();
    await rustup();
  } finally {
      core.endGroup();
  }
}
