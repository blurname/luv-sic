type GenQueryRes<T extends object> = {
  [key in keyof T as `get${Capitalize<key & string>}`]: (state: any) => T[key]
}
const genQuery = <T extends object>(
  domainSate: T,
  { getStateFn }: { getStateFn: (state: any) => any }
): GenQueryRes<T> => {
  const query: any = {}
  for (const key of Object.keys(domainSate)) {
    const UpperKey = key.substring(0, 1).toUpperCase() + key.substring(1)
    query[`get${UpperKey}`] = (state: any) => getStateFn(state)[key]
  }
  return query
}

const genEntryKey = <T extends object>(entry: T): { [key in keyof T]: key } => {
  const entryKey: any = {}
  for (const key of Object.keys(entry)) {
    entryKey[key] = key
  }
  return entryKey
}

const DomainUtil = {
  genEntryKey,
  genQuery,
}
export { DomainUtil }
