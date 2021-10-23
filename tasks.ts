#!/usr/bin/env -S deno run --unstable --allow-env --allow-read --allow-write --allow-run

import { run, runAll, sh, task, tasks } from "./mod.ts";

run(Deno.args, {
  fmt: sh("deno fmt ."),
  check: runAll(
    sh("deno fmt --check ."),
    sh("deno lint ."),
  ),
  test: sh("deno --unstable test -j 8"),
  build: task("fmt", "check", "test"),
  clean: tasks.clean,
  ci: task("check", "test"),
  st: sh("git status"),
  release: runAll(
    sh(`git tag v0.3.0`),
    sh(`git push`),
    sh(`git push --tags`),
  ),
});
