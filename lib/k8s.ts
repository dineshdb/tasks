import { sh } from "../mod.ts";

export function repo(name: string, url: string | URL) {
  return sh(`helm repo add ${name} ${url}`, true);
}

export function update(repo?: string) {
  return sh(`helm repo update ${repo ?? ''}`);
}

export function k(cmd: string) {
  return sh(`kubectl ${cmd}`);
}

export const ka = (cmd: string) => k("apply " + cmd);
export const kaf = (cmd: string) => k("apply -f " + cmd);
