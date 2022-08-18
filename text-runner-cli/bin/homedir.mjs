#!/usr/bin/env node

import {homedir} from 'node:os';
import * as tr from "text-runner-core"

console.log('Homedir: ' + homedir());
console.log(tr.activities.scaffold({}));
