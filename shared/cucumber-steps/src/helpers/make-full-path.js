"use strict";
exports.__esModule = true;
exports.makeFullPath = void 0;
var path = require("path");
function makeFullPath(command, platform) {
    if (/^text-run/.test(command)) {
        return command.replace(/^text-run/, fullTextRunPath(platform));
    }
    else {
        return fullTextRunPath(platform) + " " + command;
    }
}
exports.makeFullPath = makeFullPath;
function fullTextRunPath(platform) {
    var result = path.join(__dirname, "..", "..", "..", "..", "text-runner-cli", "bin", "text-run");
    if (platform === "win32") {
        result += ".cmd";
    }
    return result;
}
