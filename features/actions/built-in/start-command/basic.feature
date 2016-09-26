Feature: starting long-running processes

  As a tutorial writer
  I want my readers to be able to start and stop long-running processes
  So that they can start servers I am describing.

  - use the "startCommand" action to start a command
  - the command to start is provided as a code block
  - the command is run in a shell
  - if the command exits causes the test to fail

