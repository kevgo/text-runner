# Q & A

### Does this replace other testing frameworks like [Cucumber](https://cucumber.io) or [Gauge](https://gauge.org)?

No. Text-Runner complements these frameworks. Text-Runner is to make sure
end-user facing documentation is correct. Cucumber and Gauge are for more
fine-grained BDD. In particular, they are great for documenting all possible
failure scenarios which would make end-user facing documentation unreadable.

### Does this replace unit testing?

No. Text-Runner is for end-to-end testing.

### I don't want to add a `package.json` file to my root folder

No problem, you can put it in the `text-runner` folder and call TextRunner from the
root directory of your code base via:

```
$ text-runner/node_modules/.bin/text-runner
```

Remember to run `npm install` inside the `text-runner` directory as well.
