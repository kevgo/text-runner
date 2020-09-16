"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.ActivityCollector = void 0;
var tr = require("text-runner-core");
/** StatsCollector provides statistics about the Text-Runner command it observes. */
var ActivityCollector = /** @class */ (function () {
    function ActivityCollector(emitter) {
        this.activities = [];
        emitter.on(tr.CommandEvent.failed, this.onFailure.bind(this));
        emitter.on(tr.CommandEvent.skipped, this.onSkipped.bind(this));
        emitter.on(tr.CommandEvent.success, this.onSuccess.bind(this));
        emitter.on(tr.CommandEvent.warning, this.onWarning.bind(this));
    }
    ActivityCollector.prototype.results = function () {
        return this.activities;
    };
    ActivityCollector.prototype.onFailure = function (args) {
        this.activities.push(__assign(__assign({}, args), { status: "failed" }));
    };
    ActivityCollector.prototype.onSkipped = function (args) {
        this.activities.push(__assign(__assign({}, args), { status: "skipped" }));
    };
    ActivityCollector.prototype.onSuccess = function (args) {
        this.activities.push(__assign(__assign({}, args), { status: "success" }));
    };
    ActivityCollector.prototype.onWarning = function (args) {
        this.activities.push(__assign(__assign({}, args), { status: "warning" }));
    };
    return ActivityCollector;
}());
exports.ActivityCollector = ActivityCollector;
