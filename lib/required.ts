import { red } from "https://deno.land/std/fmt/colors.ts";

export async function required(...cmds: Array<string>) {
  const notIntalled = [];
  for (const cmd of cmds) {
    try {
      const p = await Deno.run({
        cmd: [cmd],
        stdin: "null",
        stdout: "null",
        stderr: "null",
      });
      const status = await p.status();
      if (!status.success) {
        notIntalled.push(cmd);
        throw new Error(`[Error]: '${cmd}' is required.`);
      }
    } catch (e) {
      notIntalled.push(cmd);
    }
  }
  if (notIntalled.length !== 0) {
    console.error(
      red(`[Error]:`),
      "Please install required command:",
      notIntalled.join(", "),
    );
    Deno.exit(1);
  }
}
