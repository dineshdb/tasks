import { sh } from "../mod.ts";

export function repo(name: string, url: string | URL) {
  return sh(`helm repo add ${name} ${url}`, true);
}
