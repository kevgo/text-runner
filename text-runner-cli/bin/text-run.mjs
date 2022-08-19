#!/usr/bin/env ts-node-esm

import { main } from "../dist/index.js"

main().catch(function(e) {
  throw e
})
