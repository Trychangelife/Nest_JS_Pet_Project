export type ConstructorPaginationType = { pageNumber: number, pageSize: number, sortBy: string, sortDirection: string };
export function constructorPagination(pageSize: string | undefined, pageNumber: string | undefined, sortBy: string | undefined, sortDirection: string | undefined,): ConstructorPaginationType {
  let result: ConstructorPaginationType = { pageSize: 10, pageNumber: 1, sortBy: 'createdAt', sortDirection: 'desc' }
  if (pageSize) result.pageSize = +pageSize
  if (pageNumber) result.pageNumber = +pageNumber
  if (sortBy) result.sortBy = sortBy
  if (sortDirection) result.sortDirection = sortDirection
  return result
}