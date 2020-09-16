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
var cucumber_1 = require("cucumber");
var execute_cli_1 = require("./helpers/execute-cli");
var textRunner = require("text-runner-core");
var activity_collector_1 = require("./activity-collector");
cucumber_1.When(/^calling:$/, function (jsText) {
    return __awaiter(this, void 0, void 0, function () {
        var world, config, command, observer, result, asyncFunc, funcText, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    config = textRunner.defaultConfiguration();
                    config.sourceDir = world.rootDir;
                    command = new textRunner.RunCommand(config);
                    observer = new activity_collector_1.ActivityCollector(command);
                    result = observer.results();
                    asyncFunc = function (tr, ac) {
                        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); });
                    };
                    funcText = "\n  asyncFunc = async function runner(textRunner, MyObserverClass) {\n    " + jsText + "\n  }";
                    eval(funcText);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, asyncFunc(textRunner, activity_collector_1.ActivityCollector)];
                case 2:
                    _a.sent();
                    world.apiResults = observer.results();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    world.apiException = e_1;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
cucumber_1.When(/^calling Text-Runner$/, function () {
    return __awaiter(this, void 0, void 0, function () {
        var world, config, command, activityCollector, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    config = textRunner.defaultConfiguration();
                    config.sourceDir = world.rootDir;
                    command = new textRunner.RunCommand(config);
                    activityCollector = new activity_collector_1.ActivityCollector(command);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, command.execute()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    world.apiException = e_2;
                    return [3 /*break*/, 4];
                case 4:
                    world.apiResults = activityCollector.results();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.When(/^(trying to run|running) "([^"]*)"$/, { timeout: 30000 }, function (tryingText, command) {
    return __awaiter(this, void 0, void 0, function () {
        var world, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    world = this;
                    _a = world;
                    return [4 /*yield*/, execute_cli_1.executeCLI(command, determineExpectError(tryingText), world)];
                case 1:
                    _a.process = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.When(/^(trying to run|running) Text-Runner$/, { timeout: 30000 }, function (tryingText) {
    return __awaiter(this, void 0, void 0, function () {
        var world, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    world = this;
                    _a = world;
                    return [4 /*yield*/, execute_cli_1.executeCLI("run", determineExpectError(tryingText), world)];
                case 1:
                    _a.process = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.When(/^(trying to run|running) Text-Runner in the source directory$/, { timeout: 30000 }, function (tryingText) {
    return __awaiter(this, void 0, void 0, function () {
        var world, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    world = this;
                    _a = world;
                    return [4 /*yield*/, execute_cli_1.executeCLI("run", determineExpectError(tryingText), world, { cwd: world.rootDir })];
                case 1:
                    _a.process = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
function determineExpectError(tryingText) {
    if (tryingText === "running") {
        return false;
    }
    else if (tryingText === "executing") {
        return false;
    }
    else if (tryingText === "calling") {
        return false;
    }
    else {
        return true;
    }
}
function finish(trying, exitCode) {
    if (trying && !exitCode) {
        throw new Error("expected error but test succeeded");
    }
    else if (trying && exitCode) {
        // nothing to do here, we expected the error
    }
    else if (exitCode) {
        if (typeof exitCode === "number") {
            throw new Error("Expected success but got exit code: " + exitCode);
        }
        else {
            throw new Error("Expected success but got error: " + exitCode);
        }
    }
}
