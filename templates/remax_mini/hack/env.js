"use strict";
/**
 * @hack dotenv取值改为 DT_ENV
 * 修改点 @hack的每一行
 */

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getEnvironment(options, target) {
    const envFilePath = path.join(options.cwd, '.env');
    const DT_ENV = process.env.DT_ENV;
    // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
    const dotenvFiles = [
        // `${envFilePath}.${DT_ENV}.local`, // @hack 不需要
        `${envFilePath}.${DT_ENV}`, // @hack
        // Don't include `.env.local` for `test` environment
        // since normally you expect tests to produce the same
        // results for everyone
        // DT_ENV !== 'test' && `${envFilePath}.local`, // @hack 不需要
        envFilePath,
    ].filter(Boolean);
    // Load environment variables from .env* files. Suppress warnings using silent
    // if this file is missing. dotenv will never modify any environment variables
    // that have already been set.  Variable expansion is supported in .env files.
    // https://github.com/motdotla/dotenv
    // https://github.com/motdotla/dotenv-expand
    dotenvFiles.forEach(dotenvFile => {
        if (fs.existsSync(dotenvFile)) {
            require('dotenv-expand')(require('dotenv').config({
                path: dotenvFile,
            }));
        }
    });
    // 注入所有 REMAX_APP_ 开头的环境变量
    const REMAX_APP = /^REMAX_APP_/i;
    const builtiEnv = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        REMAX_PLATFORM: target,
    };
    const raw = Object.keys(process.env)
        .filter(key => REMAX_APP.test(key))
        .reduce((env, key) => {
        env[key] = process.env[key];
        return env;
    }, builtiEnv);
    const stringified = Object.assign({}, Object.keys(raw).reduce((env, key) => {
        env[`process.env.${key}`] = JSON.stringify(raw[key]);
        return env;
    }, {}));
    return { raw, stringified };
}
exports.default = getEnvironment;
