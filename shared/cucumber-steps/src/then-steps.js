"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var assertNoDiff = require("assert-no-diff");
var chai_1 = require("chai");
var cucumber_1 = require("cucumber");
var fs_1 = require("fs");
var path = require("path");
var psTreeR = require("ps-tree");
var util = require("util");
var stripAnsi = require("strip-ansi");
var standardize_path_1 = require("./helpers/standardize-path");
var verify_ran_only_test_cli_1 = require("./helpers/verify-ran-only-test-cli");
var compare_execute_result_line_1 = require("./helpers/compare-execute-result-line");
var psTree = util.promisify(psTreeR);
cucumber_1.Then("it executes {int} test", function (count) {
    var world = this;
    if (!world.apiResults) {
        throw new Error("no API results found");
    }
    chai_1.assert.equal(world.apiResults.length, 1);
});
cucumber_1.Then("it executes in the local {string} directory", function (dirName) {
    var _a;
    var world = this;
    if (!world.apiResults) {
        throw new Error("no API results found");
    }
    var have = (_a = world.apiResults[0].output) === null || _a === void 0 ? void 0 : _a.trim();
    var want = path.join(world.rootDir, dirName);
    chai_1.assert.equal(have, want);
});
cucumber_1.Then("it executes these actions:", function (table) {
    var _a, _b, _c, _d, _e, _f;
    var world = this;
    chai_1.assert.isUndefined(world.apiException);
    var tableHashes = table.hashes();
    var want = [];
    for (var _i = 0, tableHashes_1 = tableHashes; _i < tableHashes_1.length; _i++) {
        var line = tableHashes_1[_i];
        var result = {};
        if (line.FILENAME != null) {
            result.filename = line.FILENAME;
        }
        if (line.LINE != null) {
            result.line = parseInt(line.LINE, 10);
        }
        if (line.ACTION != null) {
            result.action = line.ACTION;
        }
        if (line.OUTPUT != null) {
            result.output = line.OUTPUT;
        }
        if (line.ACTIVITY != null) {
            result.activity = line.ACTIVITY;
        }
        if (line.STATUS != null) {
            result.status = line.STATUS;
        }
        if (line["ERROR TYPE"] != null) {
            result.errorType = line["ERROR TYPE"] || "";
        }
        if (line["ERROR MESSAGE"] != null) {
            result.errorMessage = line["ERROR MESSAGE"];
        }
        want.push(result);
    }
    var have = [];
    var wanted = want[0];
    for (var _g = 0, _h = world.apiResults; _g < _h.length; _g++) {
        var activityResult = _h[_g];
        var result = {};
        if (wanted.filename != null) {
            result.filename = (_a = activityResult.activity) === null || _a === void 0 ? void 0 : _a.file.unixified();
        }
        if (wanted.line != null) {
            result.line = (_b = activityResult.activity) === null || _b === void 0 ? void 0 : _b.line;
        }
        if (wanted.action != null) {
            result.action = (_c = activityResult.activity) === null || _c === void 0 ? void 0 : _c.actionName;
        }
        if (wanted.output != null) {
            result.output = ((_d = activityResult.output) === null || _d === void 0 ? void 0 : _d.trim()) || "";
        }
        if (wanted.activity != null) {
            result.activity = stripAnsi(activityResult.finalName || "");
        }
        if (wanted.status != null) {
            result.status = activityResult.status;
        }
        if (wanted.errorType != null) {
            result.errorType = ((_e = activityResult.error) === null || _e === void 0 ? void 0 : _e.name) || "";
        }
        if (wanted.errorMessage != null) {
            result.errorMessage = stripAnsi(((_f = activityResult.error) === null || _f === void 0 ? void 0 : _f.message) || "");
        }
        have.push(result);
    }
    have = have.sort(compare_execute_result_line_1.compareExecuteResultLine);
    chai_1.assert.deepEqual(have, want);
});
cucumber_1.Then("it executes with this warning:", function (warning) {
    var world = this;
    chai_1.assert.isUndefined(world.apiException);
    chai_1.assert.equal(world.apiResults.length, 1, "activity results");
    chai_1.assert.equal(world.apiResults[0].message, warning);
});
cucumber_1.Then("it throws:", function (table) {
    var _a;
    var world = this;
    if (!world.apiException) {
        throw new Error("no error thrown");
    }
    var tableHash = table.hashes()[0];
    var want = {
        errorType: tableHash["ERROR TYPE"],
        errorMessage: tableHash["ERROR MESSAGE"]
    };
    if (!world.apiException) {
        throw new Error("no apiException found");
    }
    var have = {
        errorType: world.apiException.name,
        errorMessage: stripAnsi(world.apiException.message).trim().split("\n")[0]
    };
    if (tableHash.FILENAME) {
        want.filename = tableHash.FILENAME;
        have.filename = (_a = world.apiException.file) === null || _a === void 0 ? void 0 : _a.unixified();
    }
    if (tableHash.LINE) {
        want.line = parseInt(tableHash.LINE, 10);
        have.line = world.apiException.line;
    }
    chai_1.assert.deepEqual(have, want);
});
cucumber_1.Then("the error provides the guidance:", function (expectedText) {
    var _a;
    var world = this;
    var errors = world.apiResults.map(function (res) { return res.error; }).filter(function (e) { return e; });
    if (errors.length === 0) {
        throw new Error("no failed activity encountered");
    }
    chai_1.assert.equal((_a = errors[0]) === null || _a === void 0 ? void 0 : _a.name, "UserError");
    var userError = errors[0];
    chai_1.assert.equal(stripAnsi(userError.guidance.trim()), expectedText.trim());
});
cucumber_1.Then("the API exception provides the guidance:", function (expectedText) {
    var world = this;
    if (!world.apiException) {
        throw new Error("no API exception found");
    }
    chai_1.assert.equal(world.apiException.name, "UserError");
    var userError = world.apiException;
    chai_1.assert.equal(userError.guidance.trim(), expectedText.trim());
});
cucumber_1.Then("it creates a directory {string}", function (directoryPath) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.stat(path.join(world.rootDir, directoryPath))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Then("it creates the file {string} with content:", function (filename, expectedContent) {
    return __awaiter(this, void 0, void 0, function () {
        var world, actualContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.readFile(path.join(world.rootDir, filename), {
                            encoding: "utf8"
                        })];
                case 1:
                    actualContent = _a.sent();
                    assertNoDiff.trimmedLines(expectedContent, actualContent, "MISMATCHING FILE CONTENT!");
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Then("it doesn't print:", function (expectedText) {
    var world = this;
    if (!world.process) {
        throw new Error("no process output found");
    }
    var output = stripAnsi(world.process.output.fullText());
    if (new RegExp(expectedText).test(output)) {
        throw new Error("expected to not find regex '" + expectedText + "' in '" + output + "'");
    }
});
cucumber_1.Then("it prints:", function (expectedText) {
    var world = this;
    if (!world.process) {
        throw new Error("no process output found");
    }
    var output = stripAnsi(world.process.output.fullText().trim());
    if (!new RegExp(expectedText.trim()).test(output)) {
        throw new Error("expected to find regex '" + expectedText.trim() + "' in '" + output + "'");
    }
});
cucumber_1.Then("it prints the text:", function (expectedText) {
    var world = this;
    if (!world.process) {
        throw new Error("no process output found");
    }
    var output = stripAnsi(world.process.output.fullText()).trim();
    chai_1.assert.equal(output, expectedText.trim());
});
cucumber_1.Then("it runs {int} test", function (count) {
    var world = this;
    if (!world.process) {
        throw new Error("no process output found");
    }
    chai_1.assert.include(stripAnsi(world.process.output.fullText()), " " + count + " activities");
});
cucumber_1.Then("it executes in a global temp directory", function () {
    var world = this;
    chai_1.assert.notInclude(world.apiResults[0].output, world.rootDir);
});
cucumber_1.Then("it runs in a global temp directory", function () {
    var world = this;
    if (!world.process) {
        throw new Error("no CLI process found");
    }
    chai_1.assert.notInclude(world.process.output.fullText(), world.rootDir);
});
cucumber_1.Then("it runs in the local {string} directory", function (dirName) {
    var world = this;
    if (!world.process) {
        throw new Error("no process found");
    }
    var have = world.process.output.fullText();
    var want = path.join(world.rootDir, dirName);
    chai_1.assert.include(have, want);
});
cucumber_1.Then("it runs in the current working directory", function () {
    var world = this;
    if (!world.process) {
        throw new Error("no CLI process found");
    }
    chai_1.assert.match(world.process.output.fullText().trim(), new RegExp(world.rootDir + "\\b"));
});
cucumber_1.Then("it runs (only )the tests in {string}", function (filename) {
    var world = this;
    verify_ran_only_test_cli_1.verifyRanOnlyTestsCLI([filename], world);
});
cucumber_1.Then("it runs only the tests in:", function (table) {
    var world = this;
    verify_ran_only_test_cli_1.verifyRanOnlyTestsCLI(table.raw(), world);
});
cucumber_1.Then("it runs the console command {string}", function (command) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            world = this;
            if (!world.process) {
                throw new Error("no process output found");
            }
            chai_1.assert.include(stripAnsi(world.process.output.fullText()), "running console command: " + command);
            return [2 /*return*/];
        });
    });
});
cucumber_1.Then("it runs without errors", function () {
    // Nothing to do here
});
cucumber_1.Then("it signals:", function (table) {
    var world = this;
    var hash = table.rowsHash();
    var expectedText = "";
    if (hash.OUTPUT) {
        expectedText += hash.OUTPUT + "\n";
    }
    if (hash.FILENAME) {
        expectedText += hash.FILENAME;
    }
    if (hash.FILENAME && hash.LINE) {
        expectedText += ":" + hash.LINE;
    }
    if (hash.FILENAME && hash.MESSAGE) {
        expectedText += " -- ";
    }
    if (hash.MESSAGE) {
        expectedText += hash.MESSAGE;
    }
    if (hash["ERROR MESSAGE"]) {
        expectedText += " -- " + hash["ERROR MESSAGE"];
    }
    if (hash["EXIT CODE"]) {
        throw new Error("Verifying normal output but table contains an exit code");
    }
    if (!world.process) {
        throw new Error("no process results found");
    }
    var actual = standardize_path_1.standardizePath(stripAnsi(world.process.output.fullText()));
    if (!actual.includes(expectedText)) {
        throw new Error("Mismatching output!\nLooking for: " + expectedText + "\nActual content:\n" + actual + "\n");
    }
});
cucumber_1.Then("the call fails with the error:", function (expectedError) {
    var world = this;
    if (!world.process) {
        throw new Error("no process output found");
    }
    var output = stripAnsi(world.process.output.fullText());
    chai_1.assert.include(output, expectedError);
    chai_1.assert.equal(world.process.exitCode, 1);
});
cucumber_1.Then("the {string} directory is now deleted", function (directoryPath) {
    return __awaiter(this, void 0, void 0, function () {
        var world, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_1.promises.stat(path.join(world.rootDir, directoryPath))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    // we expect an exception here since the directory shouldn't exist
                    return [2 /*return*/];
                case 4: throw new Error("file '" + directoryPath + "' still exists");
            }
        });
    });
});
cucumber_1.Then("the test directory now/still contains a file {string} with content:", function (fileName, expectedContent) {
    return __awaiter(this, void 0, void 0, function () {
        var world, actualContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.readFile(path.join(world.rootDir, "tmp", fileName), "utf8")];
                case 1:
                    actualContent = _a.sent();
                    chai_1.assert.equal(actualContent.trim(), expectedContent.trim());
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Then("the test workspace now contains a directory {string}", function (name) {
    return __awaiter(this, void 0, void 0, function () {
        var world, stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.stat(path.join(world.rootDir, "tmp", name))];
                case 1:
                    stat = _a.sent();
                    chai_1.assert.isTrue(stat.isDirectory());
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Then("the test fails with:", function (table) {
    var world = this;
    var hash = table.rowsHash();
    if (!world.process) {
        throw new Error("no process result found");
    }
    var output = stripAnsi(world.process.output.fullText());
    var expectedHeader;
    if (hash.FILENAME && hash.LINE) {
        expectedHeader = hash.FILENAME + ":" + hash.LINE;
    }
    else if (hash.FILENAME) {
        expectedHeader = "" + hash.FILENAME;
    }
    else {
        expectedHeader = "";
    }
    if (hash.MESSAGE) {
        expectedHeader += " -- " + hash.MESSAGE;
    }
    chai_1.assert.include(output, expectedHeader);
    chai_1.assert.match(output, new RegExp(hash["ERROR MESSAGE"]));
    chai_1.assert.equal(world.process.exitCode, parseInt(hash["EXIT CODE"], 10));
});
cucumber_1.Then("there are no child processes running", function () {
    return __awaiter(this, void 0, void 0, function () {
        var children;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, psTree(process.pid)];
                case 1:
                    children = _a.sent();
                    chai_1.assert.lengthOf(children, 1); // 1 is okay, it's the `ps` process used to determine the child processes
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Then("there is no {string} folder", function (name) {
    return __awaiter(this, void 0, void 0, function () {
        var world, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_1.promises.stat(path.join(world.rootDir, name))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    return [2 /*return*/];
                case 4: throw new Error("Expected folder " + name + " to not be there, but it is");
            }
        });
    });
});
