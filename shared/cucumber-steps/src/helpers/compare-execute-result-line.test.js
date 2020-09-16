"use strict";
exports.__esModule = true;
var compare_execute_result_line_1 = require("./compare-execute-result-line");
var assert_1 = require("assert");
suite("executeResultLine", function () {
    test("different files", function () {
        var a = {
            filename: "1.md",
            line: 1
        };
        var b = {
            filename: "2.md",
            line: 1
        };
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(a, b), -1);
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(b, a), 1);
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(a, a), 0);
    });
    test("same file different lines", function () {
        var a = {
            filename: "1.md",
            line: 1
        };
        var b = {
            filename: "1.md",
            line: 2
        };
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(a, b), -1);
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(b, a), 1);
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(a, a), 0);
    });
    test("same file same lines", function () {
        var a = {
            filename: "1.md",
            line: 1
        };
        assert_1.strict.equal(compare_execute_result_line_1.compareExecuteResultLine(a, a), 0);
    });
});
