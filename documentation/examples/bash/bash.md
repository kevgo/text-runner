# Bash Tutorial

This is a small tutorial that demonstrates TextRunner by and teaches you
a bit of Bash along the way.

## IO Streams

There are 3 IO streams:

- stdin: input into an application
- stdout: normal program output
- stderr: output for diagnostic error messages

## Accessing command-line arguments

Bash makes command-line arguments available via `$` variables.
`$1` is the first argument, `$2` the second, etc.

Let's say we have this little Bash script that greets you by name:

<a textrun="create-file">

**greeter.sh**

```bash
#!/usr/bin/env bash

echo "Hello $1!"
```

</a>

We have to make it executable:

<a textrun="run-console-command">

```
$ chmod +x ./greeter.sh
```

</a>

When we can call it with our name:

<a textrun="run-console-command">

```
$ ./greeter.sh world
```

</a>

Then we see the output:

```
Hello world!
```

## Copying files

Copy a file using `cp`, for example:

<a textrun="run-console-command">

```
$ cp greeter.sh another_greeter.sh
```

</a>

Now we have this new file in our workspace:

<a textrun="verify-workspace-file-content">

**another_greeter.sh**

```bash
#!/usr/bin/env bash

echo "Hello $1!"
```

</a>
