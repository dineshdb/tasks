export * as tasks from "./src/mod.ts";
export * as lib from "./lib/mod.ts";
import { colors } from "./deps.ts";
import { Plugin } from "./src/plugin.ts";

export function sh(cmd: string, silent = false) {
  return async () => {
    if (!silent) {
      console.log(colors.yellow("[Run]"), cmd);
    }
    const p = await Deno.run({
      cmd: ["sh", "-c", cmd],
      stdin: "inherit",
      stdout: silent ? "null" : "inherit",
      stderr: "inherit",
    });
    const status = await p.status();
    if (!status.success && !silent) {
      throw new Error("[sh] cmd returned: " + status.code);
    }
    return status;
  };
}

function help(ctx: RunContext) {
  console.info("Folloing tasks are available: ");
  const keys = Object.keys(ctx.tasks).sort();
  for (const task of keys) {
    console.info(colors.green(`  ${task}`));
  }
}

export interface RunContext {
  args: Array<string>;
  tasks: Record<string, (_: RunContext) => unknown>;
}

export function task(...input: Array<string>) {
  return (ctx: RunContext) => {
    return _runAll(ctx, ...input.map((name) => ctx.tasks[name]));
  };
}
export async function main(
  tasks: Record<string, (_: RunContext) => unknown>,
) {
  const args = Deno.args;
  const options: RunContext = {
    tasks: {
      ...tasks,
      help: runAll(help, tasks["help"]),
    },
    args,
  };
  for (const plugin of plugins) {
    await plugin.init();
  }
  try {
    for (const arg of args) {
      const fn = options.tasks[arg];
      if (!fn) {
        throw new Error("No such task defined: " + arg);
      }
      console.log(colors.yellow("[Task]"), colors.green(arg));

      await fn(options);
    }
  } catch (e) {
    console.error(colors.red(`[Error]`), e.message);
  }
}

async function _runAll(
  ctx: RunContext,
  ...input: Array<(_: RunContext) => unknown>
) {
  for (const task of input) {
    await task(ctx);
  }
}

export function runAll(
  ...input: Array<(_: RunContext) => unknown>
): (_: RunContext) => unknown {
  return (ctx: RunContext) => _runAll(ctx, ...input);
}

const plugins: Array<Plugin<unknown>> = [];

export function withPlugin(...plugin: Array<Plugin<unknown>>) {
  plugins.push(...plugin);
}
