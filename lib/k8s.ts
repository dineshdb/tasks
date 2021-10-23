import { sh } from "../mod.ts";

export function repo(name: string, url: string | URL) {
  return sh(`helm repo add ${name} ${url}`, true);
}

export function update(repo?: string) {
  return sh(`helm repo update ${repo ?? ""}`);
}

export function helmInstall(
  name: string,
  repo: string,
  ...values: Array<string>
) {
  return sh(
    `helm upgrade -i --create-namespace ${name} ${repo} ` +
      (values.length > 0 ? " -f " + values.join(" -f ") : ""),
  );
}

export function k(cmd: string) {
  return sh(`kubectl ${cmd}`);
}

export const ka = (cmd: string) => k("apply " + cmd);
export const kad = (...cmd: Array<string>) =>
  k("delete -f " + cmd.join(" -f "));
export const kaf = (...cmd: Array<string>) => k("apply -f " + cmd.join(" -f "));
