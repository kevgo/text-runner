## Terminology

TextRunner runs _active documentation_, i.e. documentation that can be executed.
Active documentation is normal documentation that contains _active blocks_.

Active blocks are regions of text contained inside an _activation expression_.
The default activation expression is any HTML tag with a `textrun` attribute.
Its attribute value contains the name of the _action_ (test script) to execute
on the document content inside the active block.

TextRunner comes with built-in actions, for example to create files or
directories, verify file contents, run Javascript, or start external processes.

You can also create your own _custom actions_ by creating a file
`text-run/<action name>.js` in your code base which exports a Javascript
function that executes the test steps.
