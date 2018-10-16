# Q & A

> Does this replace [Cucumber](https://cucumber.io), [Gauge](https://gauge.org),
> or unit testing?

No, it complements those technologies.
Text-Runner is to make sure end-user facing behavior is correctly documented,
Cucumber and Gauge are for more fine-grained BDD
including documenting behavior in all edge cases
while unit testing is to make sure the individual components
from which you build your solution function correctly.

> I don't want to add a `package.json` file to my root folder

No problem, you can put it in the `text-run` folder
and call TextRunner from the root directory of your code base via:

```
$ text-run/node_modules/.bin/text-run
```

Remember to run `npm install` inside the `text-run` directory as well.
