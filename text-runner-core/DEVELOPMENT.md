# text-runner-core Developers Guide

## Architecture

To understand the architecture, let's follow the control flow when testing a set
of documents.

File [src/text-runner.ts](src/text-runner.ts) contains the
[JavaScript API](src/text-runner.ts) for the Text-Runner's engine. It exposes a
number of [commands](src/commands/). To run Text-Runner, you instantiate one of
these commands with [configuration data](src/configuration/data.ts) and call
their `execute` method. Please note that the Text-Runner configuration file is
considered a part of the [text-runner-cli](../text-runner-cli) wrapper. The core
engine does not load it automatically.

The Text-Runner engine is headless. When testing documentation, all it does is
emit events defined by the [events.Name](src/commands/index.ts) enum. Callers
can subscribe to this event stream to follow test progress. For example, the
[text-runner-cli](../text-runner-cli/) module displays test steps on the CLI.
The [end-to-end tests](../text-runner-features/) doesn't print anything but
collects emitted events to verify them against the events expected by the test.

Commands like the [run command](src/commands/run.ts) have a functional
architecture. It converts the configuration into test results over several
steps:

1. **configuration --> list of Markdown files to test:** this is done by the
   [filesystem module](src/filesystem)
1. **list of filenames --> list of file ASTs:** the [parse module](src/parsers)
   [reads](src/parsers/markdown/parse.ts) each file and
   [parses](src/parsers/markdown/md-parser.ts) it into the
   [standard AST](src/ast) format. The standard AST is optimized for analyzing
   and testing,and identical for comparable Markdown and HTML input.
1. **list of ASTs --> list of tests activities to execute:** the
   [activities module](src/activities) finds _active blocks_ in the ASTs and
   gathers all the related information. The output of this step is several
   lists: parallelizable tests like checking static file and image links and
   sequential tests that have to run one after the other.
1. **list of test activities --> list of test results:** the
   [run module](src/run) executes the test steps given to it and emits test
   results via the event stream described earlier.
