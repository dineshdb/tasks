import { exists, substitute } from "../deps.ts";

export async function envsubst(file: string) {
  const text = await Deno.readTextFile(file);
  const substituted = substitute(text, Deno.env.get);
  return Deno.writeTextFile(file, substituted);
}
