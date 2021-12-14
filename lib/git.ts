import { RunContext, sh } from "../mod.ts";

export async function isDirty() {
  const status = await sh(`[ -z "$(git status --porcelain)" ]`, true)();
  return status.code !== 0;
}

export function checkDirty(msg = "Working directory is dirty") {
  return async (_: RunContext) => {
    const dirty = await isDirty();
    if (dirty) {
      throw new Error(`Git: ` + msg);
    }
  };
}

export const headHash = sh(`git rev-parse --short HEAD`);
export const latestTag = sh(`git tag --sort=taggerdate --list | tail -1 `);
