Feature: unknown activity types

  As a documentation developer
  I want to be notified if my documentation uses an action for which there is no handler
  So that I can fix my documentation.

  - using an action for which there is no handler causes the test run to fail


  Scenario: using an unknown activity type
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="unknownAction">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | unknown activity type: unknownAction\nAvailable activity types: |
      | FILENAME      | 1.md                                                            |
      | EXIT CODE     | 1                                                               |
    And it prints the error message:
      """
      Available activity types:
      * cd
      * checkimage
      * checklink
      * createdirectory
      * createfile
      * minimumnodeversion
      * runconsolecommand
      * runjavascript
      * startconsolecommand
      * stopconsolecommand
      * validatejavascript
      * verifynpmglobalcommand
      * verifynpminstall
      * verifyrunconsolecommandoutput
      * verifysourcecontainsdirectory
      * verifysourcefilecontent
      * verifystartconsolecommandoutput
      * verifyworkspacecontainsdirectory
      * verifyworkspacefilecontent
      * waitforoutput

      To create a new "unknownAction" activity type,
      run "text-run add unknownAction
      """
