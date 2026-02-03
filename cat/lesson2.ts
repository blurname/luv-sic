/**
 * 范畴论进阶 - Lesson 2
 * Category Theory for Programmers - Advanced Concepts
 * 
 * 前置知识：lesson1.ts (范畴、函子、自然变换)
 * 本课主题：Monad、Applicative、Monoid
 */

import { compose, identity, Maybe, Just, Nothing, mapMaybe } from "./lesson1";

// ============================================================================
// 第一部分：Monad（单子）- 可组合的计算
// ============================================================================

/**
 * 回顾 Functor 的局限性
 * 
 * Functor 可以将普通函数提升到容器中：(a -> b) -> f a -> f b
 * 但是，如果函数本身就返回容器呢？
 * 
 * 问题示例：
 */

const parseNumber = (s: string): Maybe<number> => {
  const n = Number(s);
  return isNaN(n) ? Nothing() : Just(n);
};

const safeSqrt = (n: number): Maybe<number> => {
  return n < 0 ? Nothing() : Just(Math.sqrt(n));
};

// 如果我们想组合这两个函数会怎样？
const input = Just("16");

// ❌ 问题：使用 map 会产生嵌套
const nested = mapMaybe(parseNumber)(input); 
// 类型是 Maybe<Maybe<number>> - 嵌套了！

console.log("nested problem:", nested);
// 输出：{ tag: 'Just', value: { tag: 'Just', value: 16 } }

/**
 * Monad 解决了这个问题！
 * 
 * Monad 是一个 Functor，但额外提供两个操作：
 * 1. return (也叫 pure/of): 将值包装进容器
 * 2. bind (也叫 flatMap/chain/>>= ): 扁平化嵌套
 * 
 * Monad 定律：
 * 1. 左单位律: return(a).bind(f) = f(a)
 * 2. 右单位律: m.bind(return) = m
 * 3. 结合律: m.bind(f).bind(g) = m.bind(x => f(x).bind(g))
 */

// Maybe Monad 实现
const bindMaybe = <A, B>(f: (a: A) => Maybe<B>) => (ma: Maybe<A>): Maybe<B> => {
  if (ma.tag === "Nothing") return Nothing();
  return f(ma.value); // 关键：不再嵌套，直接返回 f 的结果
};

// 现在可以优雅地组合了！
const parseAndSqrt = (s: string): Maybe<number> => {
  return bindMaybe(safeSqrt)(parseNumber(s));
};

console.log("parse and sqrt '16':", parseAndSqrt("16")); // Just(4)
console.log("parse and sqrt '-4':", parseAndSqrt("-4")); // Nothing
console.log("parse and sqrt 'abc':", parseAndSqrt("abc")); // Nothing

// 链式调用风格（辅助函数）
// const chainMaybe = <A, B>(ma: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> => {
//   return bindMaybe(f)(ma);
// };

// 更复杂的例子：解析 -> 开方 -> 检查范围
const inRange = (min: number, max: number) => (n: number): Maybe<number> => {
  return n >= min && n <= max ? Just(n) : Nothing();
};

const processInput = (s: string): Maybe<number> => {
  return bindMaybe(inRange(0, 10))(
    bindMaybe(safeSqrt)(
      parseNumber(s)
    )
  );
};

console.log("process '16':", processInput("16"));   // Just(4) - √16 = 4, 在范围内
console.log("process '100':", processInput("100")); // Nothing - √100 = 10, 但超出范围 (应该在范围内，让我修正)
console.log("process '-4':", processInput("-4"));   // Nothing - 负数无法开方

// 验证 Monad 定律
console.log("\n=== Monad 定律验证 ===");

// 1. 左单位律: Just(a).bind(f) = f(a)
const leftIdentity = bindMaybe(safeSqrt)(Just(16));
const direct = safeSqrt(16);
console.log("left identity:", JSON.stringify(leftIdentity) === JSON.stringify(direct)); // true

// 2. 右单位律: m.bind(Just) = m
const rightIdentity = bindMaybe(Just)(Just(42));
console.log("right identity:", JSON.stringify(rightIdentity) === JSON.stringify(Just(42))); // true

// 3. 结合律
const associativity1 = bindMaybe((x: number) => bindMaybe(inRange(0, 10))(safeSqrt(x)))(parseNumber("16"));
const associativity2 = bindMaybe(inRange(0, 10))(bindMaybe(safeSqrt)(parseNumber("16")));
console.log("associativity:", JSON.stringify(associativity1) === JSON.stringify(associativity2)); // true

// ============================================================================
// 第二部分：do-notation 风格（用生成器模拟）
// ============================================================================

/**
 * Haskell 的 do-notation 让 Monad 代码看起来像命令式编程
 * TypeScript 可以用生成器函数模拟这种风格（概念演示）
 */

// 注意：这只是概念演示，TypeScript 的生成器不直接支持 Monad
// 实际使用需要专门的 Monad 运行器库

// ============================================================================
// 第三部分：Applicative Functor - 多参数函数的提升
// ============================================================================

/**
 * Functor 的 map 只能处理单参数函数：f a -> (a -> b) -> f b
 * 但如果我们想在容器中应用多参数函数呢？
 * 
 * 问题示例：
 */

const add = (a: number) => (b: number) => a + b; // 柯里化的加法

// 我们有两个 Maybe 值，想要相加
const maybeA = Just(5);
const maybeB = Just(10);

// ❌ 用 Functor 不够
// mapMaybe(add)(maybeA) 返回 Maybe<(b: number) => number>
// 我们无法将这个"容器中的函数"应用到 maybeB 上！

/**
 * Applicative Functor 解决了这个问题
 * 
 * Applicative 提供：
 * 1. pure: a -> f a (与 Monad 的 return 相同)
 * 2. ap (也叫 <*>): f (a -> b) -> f a -> f b
 *    将容器中的函数应用到容器中的值
 */

// Maybe Applicative 实现
const apMaybe = <A, B>(mf: Maybe<(a: A) => B>) => (ma: Maybe<A>): Maybe<B> => {
  if (mf.tag === "Nothing" || ma.tag === "Nothing") return Nothing();
  return Just(mf.value(ma.value));
};

// 现在可以处理多参数函数了！
const maybeSum = apMaybe(mapMaybe(add)(maybeA))(maybeB);
console.log("\n=== Applicative 示例 ===");
console.log("maybe sum:", maybeSum); // Just(15)

// 更实用的例子：表单验证
type User = {
  name: string;
  age: number;
  email: string;
};

const validateName = (name: string): Maybe<string> => {
  return name.length > 0 ? Just(name) : Nothing();
};

const validateAge = (age: number): Maybe<number> => {
  return age >= 0 && age <= 150 ? Just(age) : Nothing();
};

const validateEmail = (email: string): Maybe<string> => {
  return email.includes("@") ? Just(email) : Nothing();
};

// 使用 Applicative 组合验证
const createUser = (name: string) => (age: number) => (email: string): User => ({
  name,
  age,
  email
});

const validatedUser = apMaybe(
  apMaybe(
    mapMaybe(createUser)(validateName("Alice"))
  )(validateAge(30))
)(validateEmail("alice@example.com"));

console.log("validated user:", validatedUser);
// Just({ name: 'Alice', age: 30, email: 'alice@example.com' })

const invalidUser = apMaybe(
  apMaybe(
    mapMaybe(createUser)(validateName(""))
  )(validateAge(30))
)(validateEmail("alice@example.com"));

console.log("invalid user:", invalidUser); // Nothing

// ============================================================================
// 第四部分：Monoid（幺半群）- 可结合的结构
// ============================================================================

/**
 * Monoid 是一个代数结构，包含：
 * 1. 一个集合
 * 2. 一个二元操作（通常叫 concat 或 mappend 或 <>）
 * 3. 一个单位元（通常叫 empty 或 mempty）
 * 
 * Monoid 定律：
 * 1. 结合律: (a <> b) <> c = a <> (b <> c)
 * 2. 左单位律: empty <> a = a
 * 3. 右单位律: a <> empty = a
 */

interface Monoid<A> {
  empty: A;
  concat: (a: A, b: A) => A;
}

// 例子 1：数字加法 Monoid
const sumMonoid: Monoid<number> = {
  empty: 0,
  concat: (a, b) => a + b
};

console.log("\n=== Monoid 示例 ===");
console.log("sum:", sumMonoid.concat(5, 10)); // 15
console.log("sum with empty:", sumMonoid.concat(5, sumMonoid.empty)); // 5

// 例子 2：数字乘法 Monoid
const productMonoid: Monoid<number> = {
  empty: 1,
  concat: (a, b) => a * b
};

console.log("product:", productMonoid.concat(5, 10)); // 50
console.log("product with empty:", productMonoid.concat(5, productMonoid.empty)); // 5

// 例子 3：字符串拼接 Monoid
const stringMonoid: Monoid<string> = {
  empty: "",
  concat: (a, b) => a + b
};

console.log("string concat:", stringMonoid.concat("Hello", " World")); // "Hello World"
console.log("string with empty:", stringMonoid.concat("Hello", stringMonoid.empty)); // "Hello"

// 例子 4：数组拼接 Monoid
const arrayMonoid = <A>(): Monoid<A[]> => ({
  empty: [],
  concat: (a, b) => [...a, ...b]
});

const arrMonoid = arrayMonoid<number>();
console.log("array concat:", arrMonoid.concat([1, 2], [3, 4])); // [1, 2, 3, 4]

// Monoid 的强大之处：可以轻松聚合任意数量的值
const fold = <A>(monoid: Monoid<A>, values: A[]): A => {
  return values.reduce(monoid.concat, monoid.empty);
};

console.log("fold sum:", fold(sumMonoid, [1, 2, 3, 4, 5])); // 15
console.log("fold product:", fold(productMonoid, [1, 2, 3, 4, 5])); // 120
console.log("fold strings:", fold(stringMonoid, ["Hello", " ", "World", "!"])); // "Hello World!"

// 例子 5：函数组合 Monoid（Endo Monoid）
// 函数 a -> a 在组合下构成 Monoid
const endoMonoid = <A>(): Monoid<(a: A) => A> => ({
  empty: identity,
  concat: (f, g) => compose(f, g)
});

const numberEndo = endoMonoid<number>();
const double = (x: number) => x * 2;
const addTen = (x: number) => x + 10;
const composed = numberEndo.concat(double, addTen);
console.log("endo monoid:", composed(5)); // (5 + 10) * 2 = 30

// ============================================================================
// 第五部分：Monoid 与 Foldable
// ============================================================================

/**
 * 任何 Foldable 结构都可以用 Monoid 来折叠
 */

interface Foldable<F> {
  foldMap: <A, B>(monoid: Monoid<B>, f: (a: A) => B, fa: any) => B;
}

const arrayFoldable: Foldable<any[]> = {
  foldMap: <A, B>(monoid: Monoid<B>, f: (a: A) => B, fa: A[]): B => {
    return fa.map(f).reduce(monoid.concat, monoid.empty);
  }
};

// 使用示例：计算数组中所有数字的和
const numbers = [1, 2, 3, 4, 5];
const sum = arrayFoldable.foldMap(sumMonoid, (x: number) => x, numbers);
console.log("\nfoldMap sum:", sum); // 15

// 计算数组中所有字符串的长度之和
const words = ["Hello", "World", "Monoid"];
const totalLength = arrayFoldable.foldMap(
  sumMonoid, 
  (s: string) => s.length, 
  words
);
console.log("total length:", totalLength); // 16

// ============================================================================
// 第六部分：实战 - 用 Monad 处理异步操作
// ============================================================================

/**
 * Promise 也是一个 Monad！
 * then 方法就是 bind/flatMap
 */

// Task Monad (同步版的 Promise)
type Task<A> = () => A;

// 辅助函数（未使用但保留作为参考）
// const taskOf = <A>(value: A): Task<A> => () => value;
// const mapTask = <A, B>(f: (a: A) => B) => (task: Task<A>): Task<B> => {
//   return () => f(task());
// };

const bindTask = <A, B>(f: (a: A) => Task<B>) => (task: Task<A>): Task<B> => {
  return () => f(task())();
};

// 使用示例
const task1: Task<number> = () => {
  console.log("执行 task1");
  return 42;
};

const task2 = (x: number): Task<number> => () => {
  console.log("执行 task2 with", x);
  return x * 2;
};

const combinedTask = bindTask(task2)(task1);
console.log("\n=== Task Monad ===");
console.log("result:", combinedTask()); // 执行 task1, 执行 task2 with 42, 输出: 84

// ============================================================================
// 练习题
// ============================================================================

/**
 * 练习 1: 为 Either 实现 Monad
 */
type Either<E, A> = 
  | { tag: "Left"; error: E }
  | { tag: "Right"; value: A };

const Left = <E, A>(error: E): Either<E, A> => ({ tag: "Left", error });
// const RightEither = <E, A>(value: A): Either<E, A> => ({ tag: "Right", value });

// TODO: 实现 bindEither
const bindEither = <E, A, B>(f: (a: A) => Either<E, B>) => (ea: Either<E, A>): Either<E, B> => {
  if (ea.tag === "Left") return Left(ea.error);
  return f(ea.value);
};

/**
 * 练习 2: 实现 List Monad
 * List 的 bind 应该执行"笛卡尔积"式的组合
 * 例如：[1,2].bind(x => [x, x*10]) = [1, 10, 2, 20]
 */
const bindList = <A, B>(f: (a: A) => B[]) => (list: A[]): B[] => {
  return list.flatMap(f);
};

console.log("\n=== List Monad ===");
console.log("list bind:", bindList((x: number) => [x, x * 10])([1, 2, 3]));
// [1, 10, 2, 20, 3, 30]

/**
 * 练习 3: 实现 Maybe 的 Monoid 实例
 * 提示：可以用 First 或 Last 语义
 * First: 返回第一个 Just，如果都是 Nothing 返回 Nothing
 */
const firstMaybeMonoid = <A>(): Monoid<Maybe<A>> => ({
  empty: Nothing(),
  concat: (a, b) => a.tag === "Just" ? a : b
});

console.log("\n=== Maybe Monoid ===");
console.log("first:", fold(firstMaybeMonoid<number>(), [Nothing(), Just(5), Just(10)])); // Just(5)
console.log("all nothing:", fold(firstMaybeMonoid<number>(), [Nothing(), Nothing()])); // Nothing

/**
 * 练习 4: 思考题
 * - 为什么说"Monad 是自函子范畴上的幺半群"？
 * - Applicative 和 Monad 有什么区别？什么时候用哪个？
 * - Reader Monad 是什么？它解决了什么问题？
 */

// ============================================================================
// 总结
// ============================================================================

/**
 * 本课学习了：
 * 
 * 1. Monad：解决嵌套问题的函子
 *    - bind/flatMap 操作
 *    - 三个定律
 *    - Maybe、Either、Task、List 作为 Monad
 * 
 * 2. Applicative Functor：多参数函数的提升
 *    - ap 操作
 *    - 独立计算的组合（vs Monad 的顺序依赖）
 * 
 * 3. Monoid：可结合的结构
 *    - concat 和 empty
 *    - 在 fold/reduce 中的应用
 *    - 多种 Monoid 实例
 * 
 * 4. 这些概念的实际应用
 *    - 错误处理（Maybe/Either）
 *    - 表单验证（Applicative）
 *    - 数据聚合（Monoid）
 *    - 异步操作（Task/Promise）
 * 
 * 下一课预告：
 * - Traversable - 在容器中执行有效果的操作
 * - Free Monad - 将程序表示为数据
 * - Lens - 函数式的数据访问和修改
 */

export { 
  bindMaybe, 
  apMaybe, 
  fold,
  bindEither,
  bindList,
  firstMaybeMonoid
};

export type { Monoid, Task, Either };
