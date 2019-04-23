# Verify the output of the long-running console command

- checks that the output of the background process
  (run via [start-console-command](start_stop_process.md))
  contains the given fragments
- waits for the first occurrence of the output -
  if the application printed the output already, this step passes right away
- if you want to wait for a new occurrence of the output,
  use [verify-process-output](verify_process_output.md)

#### Example
