/* eslint-disable import/group-exports */

type Split<T extends string> = T extends `${infer Char}${infer Rest}`
  ? Char | Split<Rest>
  : never

type UpperLetter = Split<'ABCDEFGHIJKLMNOPQRSTUVWXYZ'>

export type Capital = `${UpperLetter}${string}`

type Union2Intersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export abstract class Schema {
  abstract __type: unknown
}

export type SchemaCtor<T extends Schema = Schema> = new () => T

export type InternalInfer<T> = T extends SchemaCtor<infer S> | infer S
  ? S['__type']
  : never

export type Infer<T> = T extends SchemaCtor | Schema ? InternalInfer<T> : never

export type SchemaCtorMap = {
  [key: string]: SchemaCtor
}

export type InferFromObject<T extends object> = {
  [key in keyof T as T[key] extends SchemaCtor ? key : never]: Infer<T[key]>
}

type InferFromList<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head extends SchemaCtor
    ? [Infer<Head>, ...InferFromList<Tail>]
    : InferFromList<Tail>
  : []

export class Str extends Schema {
  __type!: string
}

export class Num extends Schema {
  __type!: number
}

export class Int extends Schema {
  __type!: number
}

export class Float extends Schema {
  __type!: number
}

export class Bool extends Schema {
  __type!: boolean
}

export abstract class AbstractLiteral extends Schema {
  __type!: this['value']
  abstract value: string | number | boolean | null
}

export const Literal = <const T extends string | number | boolean | null>(
  value: T
) => {
  return class Literal extends AbstractLiteral {
    value = value
  }
}

export abstract class AbstractList extends Schema {
  __type!: Infer<this['item']>[]
  abstract item: SchemaCtor
}

export const List = <T extends SchemaCtor>(item: T) => {
  return class List extends AbstractList {
    item = item
  }
}

export type SchemaField<
  T extends object,
  key extends keyof T
> = key extends '__type'
  ? never
  : T[key] extends undefined
    ? never
    : T[key] extends SchemaCtor
      ? key
      : never

export abstract class Struct extends Schema {
  __type!: {
    [key in keyof this as SchemaField<this, key>]: Infer<this[key]>
  }
}

export abstract class NullableType extends Schema {
  __type!: Infer<this['Item']> | null | undefined
  abstract Item: SchemaCtor
}

export const Nullable = <T extends SchemaCtor>(Item: T) => {
  return class Nullable extends NullableType {
    Item = Item
  }
}

export abstract class AbstractUnion extends Schema {
  __type!: InferFromList<this['items']>[number]
  abstract items: SchemaCtor[]
}

export const Union = <T extends SchemaCtor[]>(...items: T) => {
  return class Union extends AbstractUnion {
    items = items
  }
}

export abstract class AbstractIntersection extends Schema {
  __type!: Union2Intersection<InferFromList<this['items']>>
  abstract items: SchemaCtor[]
}

export const Intersection = <T extends SchemaCtor[]>(...items: T) => {
  return class Intersection extends AbstractIntersection {
    items = items
  }
}

class Todo extends Struct {
  id = Int
  content = Str
  completed = Bool
}

const TodoList = List(Todo)

const TodoFilter = Union(
  Literal('active'),
  Literal('all'),
  Literal('completed')
)

class TodoAppState extends Struct {
  todos = TodoList
  filter = TodoFilter
  input = Str
}

type TodoAppStateType = Infer<TodoAppState>

class Tree extends Struct {
  value = Num
  children = List(Tree)
}

type TreeType = Infer<Tree>

class LinkedList extends Struct {
  value = Num
  next = Nullable(LinkedList)
}

type LinkedListType = Infer<LinkedList>

class Category extends Struct {
  name = Str
  subcategories = List(Category)
}

type CategoryType = Infer<Category>

const data = {
  name: 'People',
  subcategories: [
    {
      name: 'Politicians',
      subcategories: [
        {
          name: 'Presidents',
          subcategories: []
        }
      ]
    }
  ]
} satisfies CategoryType
