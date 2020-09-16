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
var fse = require("fs-extra");
var fs_1 = require("fs");
var path = require("path");
cucumber_1.Given("a broken file {string}", function (filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var world, subdir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    subdir = path.dirname(filePath);
                    if (!(subdir !== ".")) return [3 /*break*/, 2];
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, subdir))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, filePath), "\n      <a href=\"missing\">\n      </a>\n      ")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("a runnable file {string}", function (filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var world, subdir, subdirPath, subdirExists, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    subdir = path.dirname(filePath);
                    if (!(subdir !== ".")) return [3 /*break*/, 6];
                    subdirPath = path.join(world.rootDir, subdir);
                    subdirExists = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_1.promises.stat(subdirPath)];
                case 2:
                    _a.sent();
                    subdirExists = true;
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (!!subdirExists) return [3 /*break*/, 6];
                    return [4 /*yield*/, fs_1.promises.mkdir(subdirPath)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, filePath), '<a type="test"></a>')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("I am in a directory that contains documentation without a configuration file", function () {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "1.md"), '<code type="test"></code>')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("I am in a directory that contains the {string} example", function (exampleName) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.copy(path.join("documentation", "examples", exampleName), world.rootDir)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("I am in a directory that contains the {string} example with the configuration file:", function (exampleName, configFileContent) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.copy(path.join("documentation", "examples", exampleName), world.rootDir)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "text-run.yml"), configFileContent)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("I am in a directory that contains the {string} example( without a configuration file)", function (exampleName) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.copy(path.join("documentation", "examples", exampleName), world.rootDir)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the source code contains a directory {string}", function (dirName) {
    var world = this;
    return fse.ensureDir(path.join(world.rootDir, dirName));
});
cucumber_1.Given("the source code contains a file {string}", function (fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, path.dirname(fileName)))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, fileName), "content")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the source code contains a file {string} with content:", function (fileName, content) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, path.dirname(fileName)))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, fileName), content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the workspace contains a file {string}", function (fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, "tmp", path.dirname(fileName)))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "tmp", fileName), "content")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the workspace contains a file {string} with content {string}", function (fileName, content) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, "tmp", path.dirname(fileName)))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "tmp", fileName), content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("my workspace contains testable documentation", function () {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "1.md"), "\n<a type=\"test\">\ntestable documentation\n</a>\n    ")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the source code contains the HelloWorld action", function () {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, "text-run"))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "text-run", "hello-world.js"), "\n    module.exports = function (action) { action.log('Hello World!') }")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the workspace contains a file {string} with content:", function (fileName, content) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, "tmp", path.dirname(fileName)))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "tmp", fileName), content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the text-run configuration contains:", function (text) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.appendFile(path.join(world.rootDir, "text-run.yml"), "\n" + text)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the workspace contains a directory {string}", function (dir) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, "tmp", dir))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the workspace contains an empty file {string}", function (fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, fileName), "")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the workspace contains an image {string}", function (imageName) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fse.ensureDir(path.join(world.rootDir, path.dirname(imageName)))];
                case 1:
                    _a.sent();
                    fs_1.promises.copyFile(path.join(__dirname, "..", path.basename(imageName)), path.join(world.rootDir, imageName));
                    return [2 /*return*/];
            }
        });
    });
});
cucumber_1.Given("the configuration file:", function (content) {
    return __awaiter(this, void 0, void 0, function () {
        var world;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    world = this;
                    return [4 /*yield*/, fs_1.promises.writeFile(path.join(world.rootDir, "text-run.yml"), content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
