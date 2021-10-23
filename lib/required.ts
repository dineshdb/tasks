import { red } from "https://deno.land/std/fmt/colors.ts";

export async function required(...cmds: Array<string>) {
  const notIntalled = (await Promise.all(cmds.map(check))).filter((i) => !!i);
  if (notIntalled.length !== 0) {
    console.error(
      red(`[Error]:`),
      "Please install required command:",
      notIntalled.join(", "),
    );
    Deno.exit(1);
  }
}

async function check(cmd: string) {
  try {
    const p = await Deno.run({
      cmd: [cmd],
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
