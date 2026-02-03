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

const result1Maybe = safeDivide(10, 2);  // Just(5)
const result2Maybe = safeDivide(10, 0);  // Nothing

const mapped1 = mapMaybe(double)(result1Maybe);  // Just(10)
const mapped2 = mapMaybe(double)(result2Maybe);  // Nothing - 自动传播

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
console.log("traditional mapped:", traditionalMapped);

// 链式调用对比
// ❌ 传统方式：每一步都要检查
const traditional = unsafeDivide(100, 5);  // 20
const step1 = traditional !== null ? double(traditional) : null; // 40
const step2 = step1 !== null ? step1 + 10 : null; // 50
const step3 = step2 !== null ? square(step2) : null; // 2500
console.log("traditional chaining:", step3);

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
 * 
 * Q: 为什么有了 Maybe 还要有 Either？
 * A: 关键区别在于错误信息！
 * 
 * Maybe 的局限：
 * ❌ Nothing 只告诉你"失败了"，但不知道为什么失败
 * ❌ 当有多个可能的失败原因时，无法区分
 * ❌ 调试困难，不知道哪里出错了
 * 
 * Either 的优势：
 * ✅ Left 可以携带错误信息（字符串、错误对象、错误码等）
 * ✅ 可以区分不同的失败原因
 * ✅ 更好的错误报告和调试
 * 
 * 使用场景对比：
 * - Maybe: "这个值可能不存在"（如查找、可选配置）
 * - Either: "这个操作可能失败，且我需要知道为什么"（如解析、验证、网络请求）
 */

type Either<E, A> = 
  | { tag: "Left"; error: E }
  | { tag: "Right"; value: A };

const Left = <E, A>(error: E): Either<E, A> => ({ tag: "Left", error });
const Right = <E, A>(value: A): Either<E, A> => ({ tag: "Right", value });

// 实现 mapEither
const mapEither = <E, A, B>(f: (a: A) => B) => (ea: Either<E, A>): Either<E, B> => {
  if (ea.tag === "Left") return Left(ea.error);
  return Right(f(ea.value));
};

// ============================================================================
// Maybe vs Either 实战对比
// ============================================================================

console.log("\n=== Maybe vs Either 对比 ===");

// 场景：解析用户年龄
// 用 Maybe：只知道成功或失败
const parseAgeMaybe = (input: string): Maybe<number> => {
  const age = Number(input);
  if (isNaN(age)) return Nothing();
  if (age < 0 || age > 150) return Nothing();
  return Just(age);
};

console.log("Maybe - 'abc':", parseAgeMaybe("abc"));     // Nothing - 但不知道是解析失败还是范围错误
console.log("Maybe - '-5':", parseAgeMaybe("-5"));       // Nothing - 但不知道是解析失败还是范围错误
console.log("Maybe - '200':", parseAgeMaybe("200"));     // Nothing - 但不知道是解析失败还是范围错误

// 用 Either：知道具体的错误原因
const parseAgeEither = (input: string): Either<string, number> => {
  const age = Number(input);
  if (isNaN(age)) return Left(`"${input}" 不是有效的数字`);
  if (age < 0) return Left("年龄不能为负数");
  if (age > 150) return Left("年龄超出合理范围（0-150）");
  return Right(age);
};

console.log("Either - 'abc':", parseAgeEither("abc"));   // Left: "abc" 不是有效的数字
console.log("Either - '-5':", parseAgeEither("-5"));     // Left: 年龄不能为负数
console.log("Either - '200':", parseAgeEither("200"));   // Left: 年龄超出合理范围
console.log("Either - '25':", parseAgeEither("25"));     // Right: 25

// 更复杂的例子：表单验证
type ValidationError = 
  | { type: "empty"; field: string }
  | { type: "format"; field: string; message: string }
  | { type: "range"; field: string; min: number; max: number };

const validateEmail = (email: string): Either<ValidationError, string> => {
  if (email.length === 0) {
    return Left({ type: "empty", field: "email" });
  }
  if (!email.includes("@")) {
    return Left({ type: "format", field: "email", message: "必须包含 @" });
  }
  return Right(email);
};

const validatePassword = (pwd: string): Either<ValidationError, string> => {
  if (pwd.length === 0) {
    return Left({ type: "empty", field: "password" });
  }
  if (pwd.length < 6) {
    return Left({ type: "range", field: "password", min: 6, max: Infinity });
  }
  return Right(pwd);
};

console.log("\nEmail 验证:", validateEmail(""));           // Left: empty
console.log("Email 验证:", validateEmail("invalid"));      // Left: format error
console.log("Email 验证:", validateEmail("user@test.com")); // Right

console.log("\nPassword 验证:", validatePassword(""));     // Left: empty
console.log("Password 验证:", validatePassword("123"));    // Left: range error
console.log("Password 验证:", validatePassword("secure123")); // Right

// 总结：
// - Maybe: 简单的存在性检查，不需要错误详情时使用
// - Either: 需要错误信息、多种失败情况、调试或向用户展示错误时使用

// ============================================================================
// Result vs Either - 命名的重要性
// ============================================================================

/**
 * Q: 用 Result = Ok | Err 会是最佳选择吗？
 * A: 是的！在实际项目中，Result 通常比 Either 更好
 * 
 * Either vs Result 对比：
 * 
 * Either<E, A>:
 *   - ❌ Left/Right 语义不明确（哪个是错误？哪个是成功？）
 *   - ❌ 需要记住约定：Left = 错误，Right = 成功（right = correct 双关）
 *   - ✅ 更数学化、通用
 *   - ✅ 可以表示任意"二选一"的情况（不限于错误处理）
 * 
 * Result<T, E>:
 *   - ✅ Ok/Err 语义明确，不需要记忆约定
 *   - ✅ 更符合日常语言习惯
 *   - ✅ 代码可读性更好
 *   - ✅ Rust、Swift 等现代语言的选择
 *   - ❌ 语义上仅限于"成功/失败"场景
 * 
 * 推荐实践：
 * - 错误处理：使用 Result<T, E>（语义清晰）
 * - 其他二选一场景：使用 Either（如 Left/Right 布局方向）
 */

// Result 类型定义
type Result<T, E = string> = 
  | { tag: "Ok"; value: T }
  | { tag: "Err"; error: E };

const Ok = <T, E = string>(value: T): Result<T, E> => ({ tag: "Ok", value });
const Err = <T, E = string>(error: E): Result<T, E> => ({ tag: "Err", error });

// Result 的 Functor 实现
const mapResult = <T, U, E>(f: (t: T) => U) => (result: Result<T, E>): Result<U, E> => {
  if (result.tag === "Err") return Err(result.error);
  return Ok(f(result.value));
};

console.log("\n=== Result 类型示例 ===");

// 对比：用 Either 和 Result 实现同样的功能
const divideEither = (a: number, b: number): Either<string, number> => {
  if (b === 0) return Left("除数不能为零");
  return Right(a / b);
};

const divideResult = (a: number, b: number): Result<number, string> => {
  if (b === 0) return Err("除数不能为零");
  return Ok(a / b);
};

console.log("Either 方式:", divideEither(10, 0));  // Left { ... }
console.log("Result 方式:", divideResult(10, 0));  // Err { ... }

// 可读性对比（概念示例）
// const processDataEither = (data: string): Either<string, number> => {
//   const parsed = parseAgeEither(data);
//   if (parsed.tag === "Left") return Left(parsed.error);  // ❌ Left? 是错误吗？需要查文档
//   return Right(parsed.value * 2);
// };

// const processDataResult = (data: string): Result<number, string> => {
//   const parsed = parseAgeResult(data);
//   if (parsed.tag === "Err") return Err(parsed.error);  // ✅ Err，一眼就知道是错误
//   return Ok(parsed.value * 2);
// };

// const parseAgeResult = (input: string): Result<number, string> => {
//   const age = Number(input);
//   if (isNaN(age)) return Err(`"${input}" 不是有效的数字`);
//   if (age < 0) return Err("年龄不能为负数");
//   if (age > 150) return Err("年龄超出合理范围（0-150）");
//   return Ok(age);
// };

// 实战：API 请求错误处理
type ApiError = 
  | { type: "network"; message: string }
  | { type: "timeout"; duration: number }
  | { type: "server"; statusCode: number; message: string }
  | { type: "parsing"; reason: string };

type User = { id: number; name: string; email: string };

// 模拟 API 请求
const fetchUser = (id: number): Result<User, ApiError> => {
  if (id <= 0) {
    return Err({ type: "parsing", reason: "用户 ID 必须为正数" });
  }
  if (id === 404) {
    return Err({ type: "server", statusCode: 404, message: "用户不存在" });
  }
  // 模拟成功
  return Ok({ id, name: "Alice", email: "alice@example.com" });
};

const apiResult1 = fetchUser(1);
const apiResult2 = fetchUser(404);
const apiResult3 = fetchUser(-1);

console.log("\nAPI 请求示例:");
console.log("成功:", apiResult1);
console.log("404 错误:", apiResult2);
console.log("参数错误:", apiResult3);

// Result 的优雅错误处理
const getUserEmail = (id: number): Result<string, ApiError> => {
  const userResult = fetchUser(id);
  if (userResult.tag === "Err") return Err(userResult.error);
  return Ok(userResult.value.email);
};

console.log("\n获取邮箱:", getUserEmail(1));

// 模式匹配风格的错误处理
const handleResult = <T, E>(
  result: Result<T, E>,
  onOk: (value: T) => void,
  onErr: (error: E) => void
): void => {
  if (result.tag === "Ok") {
    onOk(result.value);
  } else {
    onErr(result.error);
  }
};

console.log("\n模式匹配示例:");
handleResult(
  fetchUser(1),
  (user) => console.log(`✅ 用户: ${user.name}`),
  (error) => console.log(`❌ 错误: ${error.type}`)
);

handleResult(
  fetchUser(404),
  (user) => console.log(`✅ 用户: ${user.name}`),
  (error) => console.log(`❌ 错误类型: ${error.type}, ${error.type === 'server' ? `状态码: ${error.statusCode}` : ''}`)
);

/**
 * 最佳实践建议：
 * 
 * 1. 在你的项目中使用 Result<T, E> 而不是 Either<E, A>
 *    - 除非你需要 Either 的通用语义
 * 
 * 2. 自定义错误类型
 *    - 使用 TypeScript 的 union type 定义详细的错误类型
 *    - 便于类型检查和错误处理
 * 
 * 3. 提供辅助函数
 *    - isOk/isErr 检查
 *    - unwrap/unwrapOr 获取值
 *    - map/flatMap/andThen 链式调用
 * 
 * 4. 考虑使用成熟的库
 *    - neverthrow: TypeScript Result 类型库
 *    - fp-ts: 完整的函数式编程工具集
 */

// 辅助函数示例
const isOk = <T, E>(result: Result<T, E>): result is { tag: "Ok"; value: T } => {
  return result.tag === "Ok";
};

const isErr = <T, E>(result: Result<T, E>): result is { tag: "Err"; error: E } => {
  return result.tag === "Err";
};

const unwrapOr = <T, E>(defaultValue: T) => (result: Result<T, E>): T => {
  return result.tag === "Ok" ? result.value : defaultValue;
};

console.log("\n辅助函数示例:");
const result = fetchUser(404);
console.log("是否成功?", isOk(result));  // false
console.log("是否失败?", isErr(result));  // true
console.log("获取值或默认:", unwrapOr({ id: 0, name: "Guest", email: "" })(result));

/**
 * 总结：
 * 
 * Maybe        - "这个值可能不存在"
 * Either<E, A> - "二选一"，通用的联合类型（数学化）
 * Result<T, E> - "成功或失败"，专门用于错误处理（语义化）✅ 推荐
 * 
 * 在 99% 的错误处理场景中，Result 是最佳选择！
 */

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

export { compose, identity, mapMaybe, mapEither, Just, Nothing, Left, Right, Ok, Err, mapResult };
export type { Maybe, Either, Result };
