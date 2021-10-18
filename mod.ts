import { config } from "https://deno.land/x/dotenv/mod.ts";
import { red, yellow } from "https://deno.land/std/fmt/colors.ts";
export * as tasks from "./src/mod.ts";

export const dotenv = config;

export function sh(cmd: string, silent = false) {
  return async () => {
    console.log(yellow("[Run]"), cmd);
    const p = await Deno.run({
      cmd: cmd.split(" "),
      stdin: "inherit",
      stdout: silent ? "inherit" : "null",
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
  try {
    const input = args.map((arg) => {
      const fn = tasks[arg];
      if (!fn) {
        throw new Error("No such task defined: " + arg);
      }
      return fn;
    });
    return runAll(...input)();
  } catch (e) {
    console.error("Error: ", e.message);
  }
}

export function runAll(...input: Array<() => unknown>): () => unknown {
  return async () => {
    for (const task of input) {
      try {
        if (!task) {
          throw new Error("No such tas defined: ");
        }
        await task();
      } catch (e) {
        console.error(e);
        return;
      }
    }
  };
}
