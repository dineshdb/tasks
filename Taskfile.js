#!/usr/bin/env -S deno run --unstable --allow-env --allow-read --allow-write --allow-run

import { run, runAll, sh, tasks } from "./mod.ts";

const fmt = sh("deno fmt .");
const lint = sh("deno lint .");
const test = sh("deno --unstable test -j 8");

run(Deno.args, {
  fmt,
  lint,
  test,
  build: runAll(fmt, lint, test),
  clean: tasks.clean,
});
