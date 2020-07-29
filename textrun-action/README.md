# Text-Runner Actions for shared Text-Runner Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of NPM modules exporting shared
Text-Runner actions:

<a textrun="action/list-full">

- [actions/name-short](#short): verifies that the contained action name is
  exported by this module
- [actions/name-full](#full): verifies that this plugin provides the given
  action
- [actions/list-short](#list-short): verifies that a list of actions contains
  all exported actions
- [actions/list-full](#list-short): verifies that a list of actions contains all
  exported actions

</a>

<a textrun="test-setup">

Let's say you work on an NPM module called `textrun-cooking`. It provides the
actions `recipe` and `utensil`. Here is how you would document individual
actions inside this NPM module:

</a>

### action/name-full

This action verifies documentation of the full name of an exported action. In
our example, we would use it like this:

<a textrun="run-in-textrunner">

```html
This module exports the <b textrun="action/name-full">cooking/recipe</b> action.
```

</a>

### action/name-short

This action verifies documentation of the short name of an exported action. In
our example, we would use it like this:

<a textrun="run-in-textrunner">

```html
This module exports the <b textrun="action/name-short">recipe</b> action.
```

</a>

### action/list-full

This action verifies that a list of all the exported actions contains all and
only the exported actions. In our example:

<a textrun="run-in-textrunner">

```md
<a textrun="action/list-full">

This module exports the following actions:

- [cooking/recipe](.)
- [cooking/utensil](.)

</a>
```

</a>

### action/list-short

Similar to

<a textrun="action/list-full">
  This module exports the following actions: - [recipe](.) - [utensil](.)
</a>
```

</a>
