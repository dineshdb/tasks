import { Plugin } from "./plugin.ts";
import { colors } from "../deps.ts";

interface RequiredOptions {
  strict: boolean;
}

export default class RequiredPlugin implements Plugin<RequiredOptions> {
  #programs: Array<string>;
  constructor(...programs: Array<string>) {
    this.#programs = programs;
  }

  async init() {
    const notIntalled = (await Promise.all(this.#programs.map(check))).filter((
      i,
    ) => !!i);
    if (notIntalled.length !== 0) {
      const msg = "Please install required command: " + notIntalled.join(", ");
      console.error(colors.red(`[Error]:`), msg);
      Deno.exit(1);
    }
  }

  deinit() {
  }

  async run() {
  }

  get defaultOptions(): RequiredOptions {
    return {
      strict: false,
    };
  }
}

export function required(...programs: Array<string>) {
  return new RequiredPlugin(...programs);
}

async function check(cmd: string) {
  try {
    const p = await Deno.run({
      cmd: ["command", "-v", cmd],
      stdin: "null",
      stdout: "null",
      stderr: "null",
    });
    const status = await p.status();
    if (!status.success) {
      return cmd;
    }
  } catch (_) {
    return cmd;
  }
}
