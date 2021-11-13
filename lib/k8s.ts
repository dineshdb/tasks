import { runAll, sh } from "../mod.ts";
import { green } from "https://deno.land/std/fmt/colors.ts";

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

export function log(instance: string, { follow, namespace }: LogOptions) {
  return sh(
    `kubectl logs ${follow ? "-f" : ""} -n ${
      namespace ?? "default"
    } ${instance}`,
  );
}

export interface K8sOptions {
  namespace?: string;
}

const defaultK8sOptions: K8sOptions = {
  namespace: "default",
};

export interface LogOnlyOptions {
  follow?: boolean;
  tail?: number;
}

type LogOptions = LogOnlyOptions & K8sOptions;

export function expose(
  service: string,
  port: number,
  options: K8sOptions = defaultK8sOptions,
) {
  const { namespace } = options;
  return runAll(
    () => console.log(green(`[INFO]: Exposing http://localhost:${port}`)),
    sh(`kubectl --namespace ${namespace} port-forward ${service} ${port}`),
  );
}
