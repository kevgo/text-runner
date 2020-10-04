# Introduction to Text-Runner

TextRunner is a tool that executes semantic rich-text. _Rich text_ is text with
basic formatting like bold, italic, links, headings, bullet points, embedded
images, etc. Text-Runner supports rich text in the form of Markdown, optionally
with embedded HTML. Knowing the _semantics_ of text means understanding what the
text is talking about. As an example, if you look at a restaurant receipt, you
know which of the numbers is the net amount, the tax, the tip for the staff, and
the total amount. You know the _meaning_ of these numbers, i.e. their semantics.
Semantic text is any text where we understand what various parts of the text
talk about. Text-Runner _executes_ semantic rich text. It understands what type
of information the various parts of a rich text document contain and runs code
for each identified document part.

### Semantic rich text format

Text-Runner can derive the semantics of some rich text elements on its own. For
example, it knows that links are references to other documents or headings
inside documents and that images reference image files. This allows Text-Runner
to verify the basic link structure of documents and prevent broken links and
images.

You can describe domain-specific semantics using the `type` attribute on HTML
tags. This attribute contains the type of the document region. As an example,
let's say we are creating an automated test for a tutorial that teaches people
how to use the command line of computers. Here is a paragraph from this
tutorial:

````markdown
## The "echo" command

Use the _echo_ command to print to the console. Try it out by running:

```
$ echo Hello world!
```

The terminal prints the output right after the call. Our first Bash program
greets us with "Hello world!"
````

At this point, a human reader of the tutorial will run `echo Hello world!` and
verify the output. To test this tutorial, all we have to do is point out which
part of the document contains the command to run and which part contains the
output to look for. We'll use `<a>` tags since they don't change the formatting
of the document.

<a type="extension/runnable-region">

````markdown
## The "echo" command

Use the _echo_ command to print to the console. Try it out by running:

<a type="shell/command">

```
$ echo Hello world!
```

</a>

The terminal prints the output right after the call. Our first Bash program
greets us with <a type="shell/command-output">`Hello world!`</a>.
````

</a>

We have created two active regions in the document. The first active region is
of type `shell/command`. It contains the shell command that the user should run.
When executing this tutorial, Text-Runner will run the `command` action from the
`shell` plugin. This action takes the textual content inside its active region
and executes it in a shell, exactly like a human user would. The second active
region contains the output expected when running this command. It takes the
output from the previous `shell/command` call and compares it against the
content inside its active region. Ultimately, Text-Runner has performed the same
steps a human reader of the tutorial would do, using the document content.
Text-Runner plays the tutorial through. This creates confindence that the
tutorial still works after making changes to either the tutorial or the product
that the tutorial describes.

Pro tip: if you have basic familiarity with HTML, you could simplify the above
paragraph to:

<a type="extension/runnable-region">

```markdown
## The "echo" command

Use the _echo_ command to print to the console. Try it out by running:

<pre type="shell/command">
$ echo Hello world!
</pre>

The terminal prints the output right after the call. Our first Bash program
greets us with <code type="shell/command-output">Hello world!</code>.
```

</a>

### Further reading

- the [built-in actions](built-in-actions.md)
- writing your own [custom actions](user-defined-actions.md)
- [configuring](configuration.md) TextRunner
