import { config } from "https://deno.land/x/dotenv/mod.ts";
import { red, yellow } from "https://deno.land/std/fmt/colors.ts";
export * as tasks from "./src/mod.ts";

export const dotenv = config;

export function sh(cmd: string) {
  return async () => {
    console.log(yellow("[Run]"), cmd);
    const p = await Deno.run({
      cmd: cmd.split(" "),
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
    const status = await p.status();
    if (!status.success) {
      console.error(red(`[Error]`), status.code);
    }
    return status;
  };
}

export function run(
  args: Array<string>,
  tasks: Record<string, () => unknown>,
) {
  return runAll(...args.map((arg) => tasks[arg]))();
}

export function runAll(...input: Array<() => unknown>): () => unknown {
  return async () => {
    for (const task of input) {
      try {
        await task();
      } catch (e) {
        console.error(e);
        return;
      }
    }
  };
}
