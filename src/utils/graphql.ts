/**
 * Clean an object by removing Apollo-specific fields like __typename
 * This is useful when passing GraphQL query results to mutations or other queries
 * that expect clean input types.
 *
 * @param obj - The object to clean (typically from a GraphQL query result)
 * @returns A new object without Apollo-specific fields
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanObjectForGraphQLInput<T extends Record<string, any>>(obj: T): Omit<T, '__typename'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...cleanObject } = obj;
  return cleanObject;
}
