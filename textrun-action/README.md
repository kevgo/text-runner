# Text-Runner Actions for shared Text-Runner Actions

<a textrun="test-setup">

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of NPM modules exporting shared
Text-Runner actions. Let's say you work on an NPM module called
`textrun-cooking` that provides the action `recipe`. Here is how you would
document individual actions inside this NPM module.

</a>

The <b textrun="action/name-full">action/name-full</b> action verifies the
documented full name of an exported action, which includes the NPM package name
without its `textrun-` prefix. In our example, we would use it like this:

<a textrun="extension/run-region">

```html
The <b textrun="action/name-full">cooking/recipe</b> action verifies recipes.
```

</a>

The <b textrun="action/name-full">action/name-short</b> action is similar to
<i textrun="action/name-full">action/name-full</i> except that the documented
action name does not contain the package name. In our example, we would use it
like this:

<a textrun="extension/run-region">

```html
The <b textrun="action/name-short">recipe</b> action verifies recipes.
```

</a>
