"use strict";
exports.__esModule = true;
exports.verifyRanOnlyTestsCLI = void 0;
var array_flatten_1 = require("array-flatten");
var chai_1 = require("chai");
var fs = require("fs");
var glob = require("glob");
var path = require("path");
function verifyRanOnlyTestsCLI(filenames, world) {
    filenames = array_flatten_1.flatten(filenames);
    if (!world.process) {
        throw new Error("no process output found");
    }
    var standardizedOutput = world.process.output.fullText().replace(/\\/g, "/");
    // verify the given tests have run
    for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
        var filename = filenames_1[_i];
        chai_1.assert.include(standardizedOutput, filename);
    }
    // verify all other tests have not run
    var filesShouldntRun = glob
        .sync(world.rootDir + "/**")
        .filter(function (file) { return fs.statSync(file).isFile(); })
        .map(function (file) { return path.relative(world.rootDir, file); })
        .filter(function (file) { return file; })
        .map(function (file) { return file.replace(/\\/g, "/"); })
        .filter(function (file) { return filenames.indexOf(file) === -1; });
    for (var _a = 0, filesShouldntRun_1 = filesShouldntRun; _a < filesShouldntRun_1.length; _a++) {
        var fileShouldntRun = filesShouldntRun_1[_a];
        chai_1.assert.notInclude(standardizedOutput, fileShouldntRun);
    }
}
exports.verifyRanOnlyTestsCLI = verifyRanOnlyTestsCLI;
