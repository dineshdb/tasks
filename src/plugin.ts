export * from "./plugin.required.ts";

export interface Plugin<ConfigType> {
  init(): unknown;

  run(): unknown;

  deinit(): unknown;

  get defaultOptions(): ConfigType;
}
