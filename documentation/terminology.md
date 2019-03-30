## Terminology

TextRunner runs _active documentation_, i.e. documentation that can be executed.
Active documentation is normal documentation
that contains _active blocks_.
Active blocks are regions of text wrapped in an _activation expression_.
The default activation expression is a `textrun` attribute on any HTML tag,
defining the _activity_ (the type of test) that should be executed using the content inside the
respective active block.
TextRunner comes with built-in activities,
for example to create files or directories, verify file contents,
or start external processes.
You can also create your own _custom activities_
by providing a file with the activity name in the `text-run` directory
of your code base, which exports a function that runs the activity.
This function is called the `action` of the activity.

Said another way, writers can perform activities through active documenation.
Each activity has a name, an action, and a bunch of associated nodes from the document.
