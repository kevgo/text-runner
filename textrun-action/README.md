# Text-Runner Actions for shared Text-Runner Actions

<a textrun="test-setup" dir="./action-workspace">

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of NPM modules exporting shared
Text-Runner actions. Let's say you work on an NPM module called
`textrun-cooking` that provides the actions `recipe` and `utensil`. Here is how
you would document individual actions inside this NPM module.

</a>

The <b textrun="action/name-full">action/name-full</b> action verifies the
documented full name of an exported action, which includes the NPM package name
without its `textrun-` prefix. In our example, we would use it like this:

<a textrun="run-in-textrunner" dir="./action-workspace">

```html
The <b textrun="action/name-full">cooking/recipe</b> action verifies recipes.
```

</a>

### action/name-short

This action is similar to [action/name-full](#action-name-full) except that the
documented action name does not contain the package name. In our example, we
would use it like this:

<a textrun="run-in-textrunner">

```html
The <b textrun="action/name-short">recipe</b> action verifies recipes.
```

</a>

### action/list-full

This action verifies a list of all exported actions. In our example:

<a textrun="run-in-textrunner">

```md
This module exports the following actions:

<a textrun="action/list-full">

- [cooking/recipe](.) link somewhere here
- [cooking/utensil](.) link somewhere here

</a>
```

</a>

### action/list-short

Similar to [action/list-full](#action-list-full) but with the short action
names:

<a textrun="run-in-textrunner">

```md
<a textrun="action/list-short">

This module exports the following actions:

- [recipe](.) link somewhere here
- [utensil](.) link somewhere here

</a>
```

</a>
