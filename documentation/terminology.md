## Terminology

TextRunner runs _active documentation_, i.e. documentation that can be executed.
Active documentation is normal documentation
that contains _active blocks_.
Active blocks are regions of text wrapped in an _activation expression_.
The default activation expression is an HTML tag with a `textrun` attribute.
The value of the `textrun` attributes defines the _activity_
(the type of test) that should be executed
using the content inside the respective active block.
You can customize the activation expression in the
[configuration](configuration.md).

TextRunner comes with built-in activities,
for example to create files or directories, verify file contents,
or start external processes.
You can also create your own _custom activities_
by providing a file with the activity name in the `text-run` directory
of your code base, which exports a function that runs the activity.
This function is called the `action` of the activity.

Said another way, developers can perform activities through active documenation.
Each activity has a name and an action
and is used in a number of active blocks in the document.
