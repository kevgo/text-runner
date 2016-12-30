Feature: unknown actions

  As a documentation developer
  I want to be notified if my documentation uses an action for which there is no handler
  So that I can fix my documentation.

  - using an action for which there is no handler causes the test run to fail


  Scenario: using an unknown action
    Given my source code contains the file "1.md" with content:
      """
      <a class="tr_unknownAction">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | unknown action: unknownAction\nAvailable actions: |
      | FILENAME      | 1.md                                              |
      | EXIT CODE     | 1                                                 |
    And it prints the error message:
      """
      Available actions:
      * tr_cd
      * tr_checkimage
      * tr_checklink
      * tr_createdirectory
      * tr_createfile
      * tr_minimumnodeversion
      * tr_runconsolecommand
      * tr_runjavascript
      * tr_startconsolecommand
      * tr_stopconsolecommand
      * tr_verifynpminstall
      * tr_verifyrunconsolecommandoutput
      * tr_verifysourcecontainsdirectory
      * tr_verifysourcefilecontent
      * tr_verifyworkspacecontainsdirectory
      * tr_verifyworkspacefilecontent
      * tr_waitforoutput
      """
