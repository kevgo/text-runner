import { ObservableProcess } from "observable-process";
import { TRWorld } from "../world";
/**
 * Executes the given command in a subshell.
 * @param command the command to execute
 * @param expectError if true, fails if the command doesn't produce an error. If false, fails if the command produces an error.
 * @param world current Cucumber state
 * @param opts.cwd If given, runs the process in that directory, otherwise in world.rootDir
 */
export declare function executeCLI(command: string, expectError: boolean, world: TRWorld, opts?: {
    cwd?: string;
}): Promise<ObservableProcess>;
//# sourceMappingURL=execute-cli.d.ts.map