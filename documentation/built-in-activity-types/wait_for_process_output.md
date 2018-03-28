### waiting for output from the long-running process

Waits until the currently running process
produces the given output.

The difference to
[verify-process-output](verify_process_output.md)
is that `wait-for-process-output` ignores previously existing output
and waits for a new occurrence of it.
