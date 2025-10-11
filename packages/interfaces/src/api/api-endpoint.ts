/**
 * Generic type for API endpoints that defines the contract between client and server.
 *
 * @template TBody - Type for request body (use `never` if no body)
 * @template TQuery - Type for query parameters (use `never` if no query)
 * @template TParams - Type for URL path parameters (use `never` if no params)
 * @template TResponse - Type for response data
 */
export type ApiEndpoint<
  TBody = never,
  TQuery = never,
  TParams = never,
  TResponse = unknown,
> = {
  body: TBody;
  query: TQuery;
  params: TParams;
  response:
    | { success: true; data: TResponse }
    | { success: false; reason?: string };
};
