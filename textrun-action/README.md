# Text-Runner Actions for Text-Runner Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of NPM modules exporting shared
Text-Runner actions.

<a textrun="action/list-short">

- [name-short](#short): verifies that the contained action name is exported by
  this module
- [name-full](#full): verifies that this plugin provides the given action
- [list-short](#list-short): verifies that a list of actions contains all
  exported actions
- [list-full](#list-short): verifies that a list of actions contains all
  exported actions

</a>

Let's say you work on an NPM module called `textrun-cooking`. It provides the
actions `recipe` and `utensil`. Here is how you would document individual
actions inside this NPM module:

<pre textrun="run-in-textrunner">
This module exports the <b textrun="action/name-short">recipe</b> action.
This module exports the <b textrun="action/name-full">cooking/recipe</b> action.
</pre>

The documentation of your Text-Runner plugin typically describes the Text-Runner
actions it provides. This

As an example, let's say your plugin exports the **foo** action. Your
documentation would look something like this:

```
This NPM package exports the <b textrun="name-short">foo</b> action.
```
