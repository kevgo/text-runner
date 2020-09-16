"use strict";
exports.__esModule = true;
exports.compareExecuteResultLine = void 0;
function compareExecuteResultLine(a, b) {
    if (!a.filename || !b.filename || !a.line || !b.line) {
        return 0;
    }
    if (a.filename > b.filename) {
        return 1;
    }
    else if (a.filename < b.filename) {
        return -1;
    }
    else {
        return a.line - b.line;
    }
}
exports.compareExecuteResultLine = compareExecuteResultLine;
