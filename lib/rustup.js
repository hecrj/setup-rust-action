"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const toolCache = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs_1 = require("fs");
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
function install() {
    return __awaiter(this, void 0, void 0, function* () {
        // `rustup` is already installed on Linux and Windows platforms
        if (os.platform() == 'darwin') {
            let toolPath = yield installOnUnix();
            core.debug('rustup is located under: ' + toolPath);
            core.addPath(path.join(toolPath, 'bin'));
        }
        else {
            // Update the GitHub managed VM version of rustup
            // to leverage newer features like "latest latest compatible nightly"
            yield exec.exec('rustup', ['self', 'update']);
            yield exec.exec('rustup', ['set', 'profile', 'minimal']);
            if (os.platform() == 'win32') {
                let cargoPath = '';
                {
                    const options = {
                        listeners: {
                            stdout: (data) => {
                                cargoPath += data.toString();
                            }
                        }
                    };
                    yield exec.exec('where', ['rustup.exe'], options);
                }
                let rustupPath = cargoPath.split('\\').slice(0, -3).concat([".rustup"]).join("\\");
                let defaultClearedFilePath = `${rustupPath}\\default_cleared`;
                if (!fs_1.existsSync(defaultClearedFilePath)) {
                    // Github's default Windows install comes with rustup pre-installed with stable, including
                    // rust-docs. This removes the default stable install so that it doesn't update rust-docs.
                    fs_1.renameSync(`${rustupPath}\\toolchains`, `${rustupPath}\\_toolchains`);
                    fs_1.appendFileSync(defaultClearedFilePath, '');
                }
            }
        }
    });
}
exports.install = install;
function installOnUnix() {
    return __awaiter(this, void 0, void 0, function* () {
        let script = yield toolCache.downloadTool("https://sh.rustup.rs");
        fs_1.chmodSync(script, '777');
        yield exec.exec(`"${script}"`, ['-y', '--default-toolchain', 'none', '--profile=minimal']);
        return path.join(process.env['HOME'] || '', '.cargo');
    });
}
