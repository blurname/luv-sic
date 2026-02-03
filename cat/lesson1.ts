/**
 * 范畴论入门 - Lesson 1
 * Category Theory for Programmers
 * 
 * 范畴论是数学的一个分支，研究抽象结构及其关系。
 * 对程序员来说，它提供了一种强大的抽象工具来思考代码结构。
 */

// ============================================================================
// 第一部分：什么是范畴 (Category)？
// ============================================================================

/**
 * 范畴由三个部分组成：
 * 1. 对象 (Objects) - 在编程中，可以理解为类型
 * 2. 态射 (Morphisms/Arrows) - 在编程中，可以理解为函数
 * 3. 组合 (Composition) - 函数的组合
 * 
 * 范畴必须满足两个定律：
 * 1. 结合律 (Associativity): (f ∘ g) ∘ h = f ∘ (g ∘ h)
 * 2. 单位律 (Identity): id ∘ f = f ∘ id = f
 */

// TypeScript 中的函数组合
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => {
  return (a: A): C => f(g(a));
};

// 单位态射 (Identity morphism)
const identity = <A>(a: A): A => a;

// ============================================================================
// 第二部分：简单的例子
// ============================================================================

// 对象：Number 类型
// 态射：Number -> Number 的函数

const double = (x: number): number => x * 2;
const addTen = (x: number): number => x + 10;
const square = (x: number): number => x * x;

// 验证组合
const doubleThenAddTen = compose(addTen, double); // (x * 2) + 10
const addTenThenDouble = compose(double, addTen); // (x + 10) * 2

console.log("double then add 10:", doubleThenAddTen(5)); // (5 * 2) + 10 = 20
console.log("add 10 then double:", addTenThenDouble(5)); // (5 + 10) * 2 = 30

// 验证结合律：(f ∘ g) ∘ h = f ∘ (g ∘ h)
// 无论如何组合，结果都应该相同
const f1 = compose(compose(square, addTen), double); // (square ∘ addTen) ∘ double
const f2 = compose(square, compose(addTen, double)); // square ∘ (addTen ∘ double)
// 两者都等价于：先 double，再 addTen，最后 square → ((x * 2) + 10)²

console.log("associativity check:", f1(3) === f2(3)); // true: 都是 (3*2+10)² = 256

// 验证单位律
const withIdentityLeft = compose(identity<number>, double);  // id ∘ double = double
const withIdentityRight = compose(double, identity<number>); // double ∘ id = double

console.log("identity left:", withIdentityLeft(5) === double(5));   // true
console.log("identity right:", withIdentityRight(5) === double(5)); // true

// ============================================================================
// 第三部分：函子 (Functor)
// ============================================================================

/**
 * 函子是范畴之间的映射，它：
 * 1. 将一个范畴中的对象映射到另一个范畴中的对象
 * 2. 将一个范畴中的态射映射到另一个范畴中的态射
 * 3. 保持组合和单位态射的结构
 * 
 * 在编程中，Functor 是一个支持 map 操作的类型构造器
 * 
 * Q: JavaScript 的 Array (List) 是一个 Functor 吗？
 * A: 是的！Array 是最经典的 Functor 例子：
 *    - 它有 map 方法：(a -> b) -> Array<a> -> Array<b>
 *    - 它满足 Functor 定律（见下面的验证）
 *    - map 把函数"提升"到数组的上下文中
 * 
 * 其他常见的 Functor：
 *    - Promise: promise.then(f) 就是 map
 *    - Maybe/Option: 处理可能不存在的值
 *    - Either/Result: 处理可能失败的计算
 *    - Function: (r -> a) 可以 map 成 (r -> b)
 */

// Array 是一个 Functor
const arrayFunctor = {
  map: <A, B>(f: (a: A) => B) => (arr: A[]): B[] => arr.map(f)
};

const numbers = [1, 2, 3, 4, 5];
const doubled = arrayFunctor.map(double)(numbers);
console.log("functor example:", doubled); // [2, 4, 6, 8, 10]

// Functor 定律 1: 保持单位态射
// fmap id = id
const mappedWithId = numbers.map((x) => identity(x));
console.log("functor identity law:", 
  JSON.stringify(mappedWithId) === JSON.stringify(numbers)); // true

// Functor 定律 2: 保持组合
// fmap (f . g) = fmap f . fmap g
const composed = numbers.map(compose(square, double));
const separate = numbers.map(double).map(square);
console.log("functor composition law:", 
  JSON.stringify(composed) === JSON.stringify(separate)); // true

// ============================================================================
// 第四部分：Maybe 函子 - 处理空值
// ============================================================================

/**
 * Maybe 是范畴论中最常见的例子之一
 * 它优雅地处理了可能不存在的值
 * 
 * Q: 为什么说"优雅"？没有 Maybe 有什么问题？
 * A: 传统的 null/undefined 处理有以下痛点：
 * 
 * 问题 1：到处都要检查 null
 * ❌ 传统方式：
 *    const user = findUser(id);
 *    if (user !== null) {
 *      const name = user.name;
 *      if (name !== null) {
 *        const upper = name.toUpperCase();
 *        if (upper !== null) {
 *          console.log(upper); // 嵌套地狱！
 *        }
 *      }
 *    }
 * 
 * ✅ Maybe 方式：
 *    findUser(id)
 *      .map(user => user.name)
 *      .map(name => name.toUpperCase())
 *      .map(console.log) // 链式调用，清晰简洁
 * 
 * 问题 2：函数组合被打断
 * ❌ 传统方式：无法直接组合可能返回 null 的函数
 *    const f = (x) => x > 0 ? x * 2 : null;
 *    const g = (x) => x < 100 ? x + 10 : null;
 *    const h = compose(g, f); // 💥 g 不知道如何处理 null！
 * 
 * ✅ Maybe 方式：函子保证了组合性
 *    const f = (x) => x > 0 ? Just(x * 2) : Nothing();
 *    const g = (x) => x < 100 ? Just(x + 10) : Nothing();
 *    // map 会自动处理 Nothing 的传播
 * 
 * 问题 3：类型系统无法强制检查
 * ❌ string | null：编译器不会强制你处理 null，容易忘记检查
 * ✅ Maybe<string>：类型系统强制你处理 Nothing 的情况
 * 
 * 问题 4：错误传播不清晰
 * ❌ 抛异常或返回 null，调用者不知道哪里出错了
 * ✅ Maybe/Either 明确表达"可能失败"的语义
 */

type Maybe<A> = { tag: "Just"; value: A } | { tag: "Nothing" };

const Just = <A>(value: A): Maybe<A> => ({ tag: "Just", value });
const Nothing = <A>(): Maybe<A> => ({ tag: "Nothing" });

// Maybe 的 map 实现
const mapMaybe = <A, B>(f: (a: A) => B) => (ma: Maybe<A>): Maybe<B> => {
  if (ma.tag === "Nothing") return Nothing();
  return Just(f(ma.value));
};

// 使用 Maybe
const safeDivide = (a: number, b: number): Maybe<number> => {
  if (b === 0) return Nothing();
  return Just(a / b);
};

const result1 = safeDivide(10, 2);  // Just(5)
const result2 = safeDivide(10, 0);  // Nothing

const mapped1 = mapMaybe(double)(result1);  // Just(10)
const mapped2 = mapMaybe(double)(result2);  // Nothing - 自动传播

console.log("maybe example 1:", mapped1); // { tag: 'Just', value: 10 }
console.log("maybe example 2:", mapped2); // { tag: 'Nothing' }

// 对比：传统方式的问题
const unsafeDivide = (a: number, b: number): number | null => {
  if (b === 0) return null;
  return a / b;
};

const traditionalResult = unsafeDivide(10, 2);
// ❌ 必须手动检查 null，否则可能崩溃
const traditionalMapped = traditionalResult !== null ? double(traditionalResult) : null;

// 链式调用对比
// ❌ 传统方式：每一步都要检查
const traditional = unsafeDivide(100, 5);  // 20
const step1 = traditional !== null ? double(traditional) : null; // 40
const step2 = step1 !== null ? step1 + 10 : null; // 50
const step3 = step2 !== null ? square(step2) : null; // 2500

// ✅ Maybe 方式：清晰的链式调用
const elegant = mapMaybe(square)(
  mapMaybe((x: number) => x + 10)(
    mapMaybe(double)(safeDivide(100, 5))
  )
); // Just(2500)
console.log("elegant chaining:", elegant);

// ============================================================================
// 第五部分：自然变换 (Natural Transformation)
// ============================================================================

/**
 * 自然变换是函子之间的映射
 * 它将一个函子变换为另一个函子，同时保持结构
 */

// 从 Array 到 Maybe 的自然变换
const safeHead = <A>(arr: A[]): Maybe<A> => {
  if (arr.length === 0) return Nothing();
  return Just(arr[0]);
};

// 自然性条件：
// fmap f . η = η . fmap f
// 其中 η 是自然变换（这里是 safeHead）

const arr = [1, 2, 3];
const way1 = mapMaybe(double)(safeHead(arr));        // 先取头，再 map
const way2 = safeHead(arrayFunctor.map(double)(arr)); // 先 map，再取头

console.log("natural transformation:", 
  JSON.stringify(way1) === JSON.stringify(way2)); // true

// ============================================================================
// 练习题
// ============================================================================

/**
 * 练习 1: 实现一个 Either 函子
 * Either 可以表示两种可能的值：Left (通常表示错误) 或 Right (表示成功的值)
 */

type Either<E, A> = 
  | { tag: "Left"; error: E }
  | { tag: "Right"; value: A };

const Left = <E, A>(error: E): Either<E, A> => ({ tag: "Left", error });
const Right = <E, A>(value: A): Either<E, A> => ({ tag: "Right", value });

// TODO: 实现 mapEither
const mapEither = <E, A, B>(f: (a: A) => B) => (ea: Either<E, A>): Either<E, B> => {
  // 你的实现
  if (ea.tag === "Left") return Left(ea.error);
  return Right(f(ea.value));
};

/**
 * 练习 2: 验证你的 Either 实现满足 Functor 定律
 */

/**
 * 练习 3: 思考题
 * - Promise 是一个 Functor 吗？为什么？
 * - Function 类型 (a -> b) 可以是 Functor 吗？如果可以，如何实现？
 */

// ============================================================================
// 总结
// ============================================================================

/**
 * 本课学习了：
 * 
 * 1. 范畴的基本概念：对象、态射、组合
 * 2. 范畴定律：结合律和单位律
 * 3. 函子：在范畴之间保持结构的映射
 * 4. 函子定律：保持单位态射和组合
 * 5. 实际例子：Array、Maybe、Either
 * 6. 自然变换：函子之间的映射
 * 
 * 下一课预告：
 * - Monad（单子）- 可组合的计算
 * - Applicative Functor - 多参数函数的提升
 * - Monoid（幺半群）- 可结合的结构
 */

export { compose, identity, mapMaybe, mapEither };
export type { Maybe, Either };
