/// <reference types="node" />
import * as events from "events";
import * as tr from "text-runner-core";
/** Statistics about a run of Text-Runner */
export interface ActivityResult {
    activity?: tr.Activity;
    finalName?: string;
    status: "success" | "failed" | "skipped" | "warning";
    output?: string;
    error?: Error;
    message?: string;
}
/** StatsCollector provides statistics about the Text-Runner command it observes. */
export declare class ActivityCollector {
    activities: ActivityResult[];
    constructor(emitter: events.EventEmitter);
    results(): ActivityResult[];
    onFailure(args: tr.FailedArgs): void;
    onSkipped(args: tr.SkippedArgs): void;
    onSuccess(args: tr.SuccessArgs): void;
    onWarning(args: tr.WarnArgs): void;
}
//# sourceMappingURL=activity-collector.d.ts.map