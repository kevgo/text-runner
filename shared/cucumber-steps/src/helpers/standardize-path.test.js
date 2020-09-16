"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var standardize_path_1 = require("./standardize-path");
suite("standardizePath", function () {
    test("unix path", function () {
        chai_1.assert.equal(standardize_path_1.standardizePath("foo/bar"), "foo/bar");
    });
    test("windows path", function () {
        chai_1.assert.equal(standardize_path_1.standardizePath("foo\\bar"), "foo/bar");
    });
});
