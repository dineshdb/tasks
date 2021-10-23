interface QueryOptions {
  url: string;
  query: string;
  variables: Record<string, unknown>;
}
export async function graphqlQuery({
  url,
  query,
  variables,
  ...options
}: QueryOptions) {
  const json = await getJSON(url, {
    body: {
      query,
      variables,
    },
    ...options,
  });
  return json;
}

interface JSONOptions {
  headers?: Record<string, unknown>;
  body: Record<string, unknown>;
}

export function getJSON(
  url: string,
  { headers = {}, body, ...otherOptions }: JSONOptions,
) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    ...otherOptions,
  }).then((res) => res.json());
}
