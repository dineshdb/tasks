#!/usr/bin/env -S deno run --unstable --allow-env --allow-read --allow-write --allow-run

import { checkDirty } from "./lib/git.ts";
import { main, runAll, sh, task } from "./mod.ts";
import { withPlugin } from "./mod.ts";
import { required } from "./src/plugin.ts";

withPlugin(
  required("deno"),
);

main({
  fmt: sh("deno fmt ."),
  check: runAll(
    sh("deno fmt --check ."),
    sh("deno lint ."),
  ),
  test: sh("deno --unstable test -j 8"),
  build: task("fmt", "check", "test"),
  ci: task("check", "test"),
  st: sh("git status"),
  release: runAll(
    checkDirty(),
    sh(`git tag v0.5.0`),
    sh(`git push`),
    sh(`git push --tags`),
  ),
});
