export type ConstructorPaginationType = { pageNumber: number, pageSize: number };
export function constructorPagination(pageSize: string | undefined, pageNumber: string | undefined): ConstructorPaginationType {
  let result: ConstructorPaginationType = { pageSize: 10, pageNumber: 1 }
  if (pageSize) result.pageSize = +pageSize
  if (pageNumber) result.pageNumber = +pageNumber
  return result
}