import { colors } from "../deps.ts";

export async function required(...cmds: Array<string>) {
  const notIntalled = (await Promise.all(cmds.map(check))).filter((i) => !!i);
  if (notIntalled.length !== 0) {
    const msg = "Please install required command: " + notIntalled.join(", ");
    console.error(colors.red(`[Error]:`), msg);
    Deno.exit(1);
  }
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
