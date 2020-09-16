"use strict";
exports.__esModule = true;
var make_full_path_1 = require("./make-full-path");
var assert_1 = require("assert");
suite("makeFullPath", function () {
    var linuxTests = {
        "text-run foo": /.+\/bin\/text-run foo$/,
        run: /.+\/bin\/text-run run$/
    };
    var winTests = {
        "text-run foo": /.+\\bin\\text-run.cmd foo$/,
        run: /.+\\bin\\text-run.cmd run$/
    };
    if (process.platform !== "win32") {
        var _loop_1 = function (give, want) {
            test("Linux: " + give + " --> " + want, function () {
                var have = make_full_path_1.makeFullPath(give, "linux");
                assert_1.strict.match(have, want);
            });
        };
        for (var _i = 0, _a = Object.entries(linuxTests); _i < _a.length; _i++) {
            var _b = _a[_i], give = _b[0], want = _b[1];
            _loop_1(give, want);
        }
    }
    if (process.platform === "win32") {
        var _loop_2 = function (give, want) {
            test("Windows: " + give + " --> " + want, function () {
                var have = make_full_path_1.makeFullPath(give, "win32");
                assert_1.strict.match(have, want);
            });
        };
        for (var _c = 0, _d = Object.entries(winTests); _c < _d.length; _c++) {
            var _e = _d[_c], give = _e[0], want = _e[1];
            _loop_2(give, want);
        }
    }
});
