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
const rustup = __importStar(require("./rustup"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            if (version) {
                yield rustup.install();
                yield exec.exec('rustup', ['default', version]);
                yield exec.exec('rustup', ['update', version]);
                for (let component of components) {
                    yield exec.exec('rustup', ['component', 'add', component]);
                }
                for (let target of targets) {
                    yield exec.exec('rustup', ['target', 'add', target]);
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
