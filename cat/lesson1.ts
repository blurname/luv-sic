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

// ============================================================================
// Tagged Union vs Functor - 深入理解
// ============================================================================

/**
 * Q: Tagged Union 算 Functor 吗？
 * A: 不完全是！关键在于理解两个概念的区别
 * 
 * Tagged Union (标签联合):
 * - 是一种"构建数据类型的技术"
 * - TypeScript 中通过 discriminated union 实现
 * - 本身只是类型系统的特性，不是 Functor
 * 
 * Functor:
 * - 是一个"类型类 (typeclass)"或"接口"
 * - 需要实现 map 操作
 * - 需要满足 Functor 定律
 * 
 * 关系：
 * ✅ 用 Tagged Union 构建的类型"可能"是 Functor
 * ❌ 不是所有 Tagged Union 都是 Functor
 */

console.log("\n=== Tagged Union 与 Functor ===");

// 例子 1: Maybe 是 Tagged Union，也是 Functor ✅
// Maybe 是 Tagged Union（有 Just 和 Nothing 两个标签）
// Maybe 也是 Functor（可以实现 map，满足 Functor 定律）
type MaybeExample<A> = 
  | { tag: "Just"; value: A }
  | { tag: "Nothing" };

const mapMaybeExample = <A, B>(f: (a: A) => B) => (ma: MaybeExample<A>): MaybeExample<B> => {
  if (ma.tag === "Nothing") return { tag: "Nothing" };
  return { tag: "Just", value: f(ma.value) };
};

console.log("Maybe 既是 Tagged Union 又是 Functor");
const maybeTest = mapMaybeExample((x: number) => x * 2)({ tag: "Just", value: 5 });
console.log("  测试:", maybeTest); // { tag: "Just", value: 10 }

// 例子 2: 不是所有 Tagged Union 都能成为 Functor ❌
// 这个 Tagged Union 无法成为 Functor
// type Direction = 
//   | { tag: "North" }
//   | { tag: "South" }
//   | { tag: "East" }
//   | { tag: "West" };

// ❌ Direction 无法实现 map！
// map 的签名应该是：(A -> B) -> Direction<A> -> Direction<B>
// 但是 Direction 没有类型参数！它不包含任何值
// 无法"提升"函数到这个类型上

console.log("Direction 是 Tagged Union，但不是 Functor（没有类型参数）");

// 例子 3: 有类型参数但仍然不是 Functor 的情况
// type Predicate<A> = {
//   tag: "Predicate";
//   check: (a: A) => boolean;  // A 在"逆变位置"（函数参数）
// };

// ❌ Predicate 无法正确实现 map
// 如果我们有 Predicate<number>，想 map 成 Predicate<string>
// 我们需要一个函数 f: number -> string
// 但是 check: (number) => boolean 无法转换为 (string) => boolean
// 因为 A 在函数参数位置（逆变），不在返回值位置（协变）

console.log("Predicate 有类型参数，但不是 Functor（类型参数在逆变位置）");

// 例子 4: 什么样的 Tagged Union 可以成为 Functor？✅

/**
 * Functor 的充分条件：
 * 1. 必须是泛型类型（有类型参数，如 F<A>）
 * 2. 类型参数必须在"协变位置"（作为返回值、字段等）
 * 3. 能实现有意义的 map 操作
 * 4. 满足 Functor 定律
 */

// ✅ Maybe: 有类型参数 A，A 在 value 字段（协变位置）
// ✅ Either: 有类型参数 A，A 在 value 字段（协变位置）
// ✅ Result: 有类型参数 T，T 在 value 字段（协变位置）

// ✅ Tree 也可以是 Functor
type Tree<A> = 
  | { tag: "Leaf"; value: A }
  | { tag: "Branch"; left: Tree<A>; right: Tree<A> };

const mapTree = <A, B>(f: (a: A) => B) => (tree: Tree<A>): Tree<B> => {
  if (tree.tag === "Leaf") {
    return { tag: "Leaf", value: f(tree.value) };
  }
  return {
    tag: "Branch",
    left: mapTree(f)(tree.left),
    right: mapTree(f)(tree.right)
  };
};

const numberTree: Tree<number> = {
  tag: "Branch",
  left: { tag: "Leaf", value: 1 },
  right: { tag: "Leaf", value: 2 }
};

const stringTree = mapTree((n: number) => n.toString())(numberTree);
console.log("Tree Functor:", stringTree);

// ✅ List (链表) 也可以是 Functor
type List<A> = 
  | { tag: "Nil" }
  | { tag: "Cons"; head: A; tail: List<A> };

const mapList = <A, B>(f: (a: A) => B) => (list: List<A>): List<B> => {
  if (list.tag === "Nil") return { tag: "Nil" };
  return {
    tag: "Cons",
    head: f(list.head),
    tail: mapList(f)(list.tail)
  };
};

const numberList: List<number> = {
  tag: "Cons",
  head: 1,
  tail: { tag: "Cons", head: 2, tail: { tag: "Nil" } }
};

const doubledList = mapList((n: number) => n * 2)(numberList);
console.log("List Functor:", doubledList);

// 例子 5: 不能成为 Functor 的其他情况（概念示例）

// ❌ 类型参数出现在函数参数位置
// type Consumer<A> = {
//   tag: "Consumer";
//   consume: (a: A) => void;  // 逆变
// };

// ❌ 类型参数被"固定"了
// type FixedPair = 
//   | { tag: "IntPair"; first: number; second: number }
//   | { tag: "StrPair"; first: string; second: string };
// 没有泛型参数，无法 map

// ❌ 类型参数在等式约束中
// type Equal<A> = {
//   tag: "Equal";
//   left: A;
//   right: A;
//   equals: (a: A, b: A) => boolean;  // A 既在协变位置又在逆变位置
// };

console.log("\n=== 验证：协变位置 vs 逆变位置 ===");

/**
 * Q: 逆变就是参数，协变就是返回值？
 * A: 基本正确，但更准确的说法是：
 * 
 * 协变（Covariant）：类型参数在"输出位置"
 * - ✅ 函数返回值
 * - ✅ 对象的字段/属性（只读）
 * - ✅ Promise 的值
 * - ✅ 数组的元素（读取时）
 * 
 * 逆变（Contravariant）：类型参数在"输入位置"
 * - ✅ 函数参数
 * - ✅ 只写属性（少见）
 * 
 * 不变（Invariant）：类型参数既在输入又在输出位置
 * - ✅ 可读可写的属性
 * - ✅ 数组（TypeScript 中，因为可读可写）
 */

// 例子 1：协变 - 类型参数在输出位置
type Producer<A> = () => A;  // A 在返回值位置（输出）

const producerNumber: Producer<number> = () => 42;
const producerValue: Producer<number | string> = producerNumber; // ✅ 可以赋值
// 因为 number 是 number|string 的子类型，Producer<number> 可以赋值给 Producer<number|string>
// 这就是协变：Producer<A> 跟随 A 的子类型关系

console.log("协变例子 (Producer):", producerValue());

// 协变可以实现 map（Functor）
const mapProducer = <A, B>(f: (a: A) => B) => (producer: Producer<A>): Producer<B> => {
  return () => f(producer());
};

const stringProducer = mapProducer((n: number) => n.toString())(producerNumber);
console.log("  map Producer:", stringProducer()); // "42"

// 例子 2：逆变 - 类型参数在输入位置
type Consumer<A> = (a: A) => void;  // A 在参数位置（输入）

const consumerUnion: Consumer<number | string> = (x) => console.log("  received:", x);
const consumerNumber: Consumer<number> = consumerUnion; // ✅ 可以赋值
// 因为 Consumer<number|string> 可以接受 number，所以可以赋值给 Consumer<number>
// 这就是逆变：Consumer<A> 反向于 A 的子类型关系

consumerNumber(42);

// 逆变不能实现 map，但可以实现 contramap
const contramapConsumer = <A, B>(f: (b: B) => A) => (consumer: Consumer<A>): Consumer<B> => {
  return (b: B) => consumer(f(b));  // 注意：函数方向反了！
};

const stringConsumer = contramapConsumer(
  (s: string) => parseInt(s)  // string -> number
)(consumerUnion);  // Consumer<number|string>

stringConsumer("100"); // 输出: received: 100

// 例子 3：对象字段的协变
type Box<A> = {
  readonly value: A;  // 只读 - 协变
};

const boxNumber: Box<number> = { value: 42 };
const boxUnion: Box<number | string> = boxNumber; // ✅ 协变
console.log("\n对象字段协变:", boxUnion.value);

// 例子 4：不变 - 可读可写（概念示例）
// type MutableBox<A> = {
//   value: A;  // 可读可写 - 不变（invariant）
// };

// const mutableBoxNumber: MutableBox<number> = { value: 42 };
// const mutableBoxUnion: MutableBox<number | string> = mutableBoxNumber; // ❌ TypeScript 会报错（如果开启 strictFunctionTypes）
// 为什么？因为：
// - 读取时：需要协变（number -> number|string）✅
// - 写入时：需要逆变（可能会写入 string，但 mutableBoxNumber 只接受 number）❌
// 所以必须是不变的

console.log("\n可读可写属性是不变的（Invariant）");

// 例子 5：函数类型的组合
type Transformer<A, B> = (a: A) => B;

// A 在参数位置（逆变），B 在返回值位置（协变）
// 所以 Transformer 在 A 上逆变，在 B 上协变

const transformNumberToNumber: Transformer<number, number> = (x) => x * 2;
// 理论上：Transformer 在第一个参数逆变，第二个参数协变
// 但 TypeScript 默认对函数参数是双变的（bivariant），需要 strictFunctionTypes 才严格
console.log("\n函数类型的协变/逆变组合:", transformNumberToNumber(21));

// 例子 6：数组在 TypeScript 中是不变的（虽然在理论上应该协变）
// const numbersArray: number[] = [1, 2, 3];
// const unionArray: (number | string)[] = numbersArray; 
// ❌ 在严格模式下会报错（虽然看起来应该可以）
// 原因：数组既可读又可写
// - 读取 numbersArray[0] -> number，协变没问题
// - 写入 unionArray[0] = "hello" -> 但 numbersArray 只接受 number！❌

console.log("\n数组因为可读可写，所以是不变的");

// 例子 7：实际的 Contravariant Functor - Comparison
type Comparison<A> = (a: A, b: A) => number;  // 用于排序

const compareNumbers: Comparison<number> = (a, b) => a - b;

// contramap：将 Comparison<A> 转换为 Comparison<B>
const contramapComparison = <A, B>(f: (b: B) => A) => (cmp: Comparison<A>): Comparison<B> => {
  return (b1, b2) => cmp(f(b1), f(b2));
};

type Person = { name: string; age: number };

// 通过提取 age 字段，复用 number 的比较器
const comparePersonsByAge = contramapComparison(
  (p: Person) => p.age
)(compareNumbers);

const people: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 }
];

const sorted = [...people].sort(comparePersonsByAge);
console.log("\nContravariant Functor 实例 - 排序:");
console.log("  原始:", people.map(p => p.name));
console.log("  按年龄排序:", sorted.map(p => `${p.name}(${p.age})`));

/**
 * 总结：协变与逆变
 * 
 * 1. 协变（Covariant）：
 *    - 位置：输出位置（返回值、只读字段）
 *    - 子类型：F<A> 跟随 A 的子类型关系
 *    - 例子：Producer<A>, Box<A>, Promise<A>
 *    - 操作：map (Functor)
 *    - 直觉：生产数据
 * 
 * 2. 逆变（Contravariant）：
 *    - 位置：输入位置（函数参数、只写字段）
 *    - 子类型：F<A> 反向于 A 的子类型关系
 *    - 例子：Consumer<A>, Comparison<A>, Predicate<A>
 *    - 操作：contramap (Contravariant Functor)
 *    - 直觉：消费数据
 * 
 * 3. 不变（Invariant）：
 *    - 位置：既在输入又在输出（可读可写）
 *    - 子类型：不能进行子类型转换
 *    - 例子：MutableBox<A>, Array<A> (in TypeScript)
 *    - 操作：需要同时提供 map 和 contramap
 *    - 直觉：既生产又消费
 * 
 * 4. 记忆口诀：
 *    - "返回值协变，参数逆变"（基本正确）
 *    - 更准确：输出协变，输入逆变
 *    - 可读写不变
 * 
 * 5. 实际应用：
 *    - Functor: 处理协变类型（map）
 *    - Contravariant: 处理逆变类型（contramap）
 *    - 类型安全：理解协变/逆变可以写出更安全的泛型代码
 */

console.log("\n协变/逆变总结:");
console.log("  协变 = 输出位置 = 生产数据 = Functor");
console.log("  逆变 = 输入位置 = 消费数据 = Contravariant Functor");
console.log("  不变 = 既输入又输出 = 可读可写");

/**
 * 总结：Tagged Union 与 Functor 的关系
 * 
 * 1. Tagged Union 是构建数据类型的技术
 *    - 用 | 和 tag 字段构建不同的变体
 *    - TypeScript、Rust、Haskell 等都支持
 * 
 * 2. Functor 是类型类/接口
 *    - 需要实现 map: (A -> B) -> F<A> -> F<B>
 *    - 需要满足定律
 * 
 * 3. 一个 Tagged Union 可以成为 Functor 当且仅当：
 *    ✅ 它有泛型参数（如 Maybe<A>）
 *    ✅ 类型参数在协变位置（输出位置）
 *    ✅ 可以实现有意义的 map
 *    ✅ 满足 Functor 定律
 * 
 * 4. 实例：
 *    ✅ Functor: Maybe, Either, Result, Array, Tree, List
 *    ❌ 不是 Functor: Direction（无类型参数）, Predicate（逆变）
 * 
 * 5. 特殊情况：
 *    - Contravariant Functor: 类型参数在逆变位置
 *    - Invariant Functor: 类型参数既在协变又在逆变位置
 *    - Bifunctor: 有两个类型参数都可以 map（如 Either）
 */

// ============================================================================
// Tagged Union 在范畴论中的对应：Coproduct（余积/和类型）
// ============================================================================

/**
 * Q: Tagged Union 在范畴论里面有对应的内容吗？
 * A: 有！就是 Coproduct（余积），也叫 Sum Type（和类型）
 * 
 * 范畴论中的基本构造：
 * 
 * 1. Product（积/积类型）
 *    - 对应：Tuple, Struct, Record, Class
 *    - 符号：A × B
 *    - 例子：{ name: string, age: number }
 *    - 含义：同时拥有 A 和 B
 *    - 代数：|A × B| = |A| × |B|（乘法）
 * 
 * 2. Coproduct（余积/和类型）
 *    - 对应：Tagged Union, Enum, Variant
 *    - 符号：A + B
 *    - 例子：{ tag: "Left", value: A } | { tag: "Right", value: B }
 *    - 含义：要么是 A，要么是 B
 *    - 代数：|A + B| = |A| + |B|（加法）
 * 
 * Product vs Coproduct 是对偶的（Dual）关系！
 */

console.log("\n=== Product vs Coproduct ===");

// Product（积类型）- AND 逻辑
type Pair<A, B> = {
  first: A;
  second: B;
};

// 同时需要两个值
const pair: Pair<number, string> = {
  first: 42,
  second: "hello"
};

console.log("Product 例子:", pair);
// 可能的值数量：|number| × |string|（乘法）

// Coproduct（和类型）- OR 逻辑  
type Sum<A, B> = 
  | { tag: "Left"; value: A }
  | { tag: "Right"; value: B };

// 二选一
const sumLeft: Sum<number, string> = { tag: "Left", value: 42 };
const sumRight: Sum<number, string> = { tag: "Right", value: "hello" };

console.log("Coproduct 例子 (Left):", sumLeft);
console.log("Coproduct 例子 (Right):", sumRight);
// 可能的值数量：|number| + |string|（加法）

/**
 * 泛性质（Universal Property）
 * 
 * Product 的泛性质：
 * - 给定两个投影函数 fst: A × B -> A 和 snd: A × B -> B
 * - 对于任何类型 C 和函数 f: C -> A, g: C -> B
 * - 存在唯一的函数 h: C -> A × B，使得 fst ∘ h = f 且 snd ∘ h = g
 */

// Product 的消除（Elimination）
const fst = <A, B>(pair: Pair<A, B>): A => pair.first;
const snd = <A, B>(pair: Pair<A, B>): B => pair.second;

// Product 的引入（Introduction）
// const makePair = <A, B>(a: A, b: B): Pair<A, B> => ({ first: a, second: b });

console.log("\nProduct 操作:");
console.log("  fst:", fst(pair));  // 42
console.log("  snd:", snd(pair));  // "hello"

/**
 * Coproduct 的泛性质：
 * - 给定两个注入函数 inl: A -> A + B 和 inr: B -> A + B
 * - 对于任何类型 C 和函数 f: A -> C, g: B -> C
 * - 存在唯一的函数 h: A + B -> C，使得 h ∘ inl = f 且 h ∘ inr = g
 */

// Coproduct 的引入（Introduction）- 注入函数
const inl = <A, B>(value: A): Sum<A, B> => ({ tag: "Left", value });
const inr = <A, B>(value: B): Sum<A, B> => ({ tag: "Right", value });

// Coproduct 的消除（Elimination）- 模式匹配/折叠
const matchSum = <A, B, C>(
  sum: Sum<A, B>,
  onLeft: (a: A) => C,
  onRight: (b: B) => C
): C => {
  if (sum.tag === "Left") return onLeft(sum.value);
  return onRight(sum.value);
};

console.log("\nCoproduct 操作:");
console.log("  inl:", inl<number, string>(42));
console.log("  inr:", inr<number, string>("hello"));
console.log("  match left:", matchSum(sumLeft, (n: number) => n * 2, (s: string) => s.length));  // 84
console.log("  match right:", matchSum(sumRight, (n: number) => n * 2, (s: string) => s.length)); // 5

// ============================================================================
// 代数数据类型（Algebraic Data Types, ADT）
// ============================================================================

/**
 * 为什么叫"代数"数据类型？
 * 因为它们遵循代数规则！
 * 
 * 类型的"大小"（可能的值数量）：
 * - Void（空类型）: 0
 * - Unit（单元类型）: 1
 * - Bool: 2
 * - Product A × B: |A| × |B|
 * - Coproduct A + B: |A| + |B|
 * - Function A -> B: |B|^|A|
 */

// Void - 没有值的类型（0）- 在类型层面使用，无法构造值
// type Void = never;

// Unit - 只有一个值的类型（1）
type Unit = { tag: "Unit" };
const unit: Unit = { tag: "Unit" };

// Bool - 两个值的类型（2）
type Bool = { tag: "True" } | { tag: "False" };
const trueVal: Bool = { tag: "True" };
const falseVal: Bool = { tag: "False" };

console.log("\n=== 代数数据类型 ===");
console.log("Unit:", unit);
console.log("Bool:", trueVal, falseVal);

// 代数恒等式（类型示例，未使用但展示概念）
// A × 1 = A（Unit 是 Product 的单位元）
// type PairWithUnit<A> = Pair<A, Unit>;
// 同构于 A（isomorphic）

// A + 0 = A（Void 是 Coproduct 的单位元）
// type SumWithVoid<A> = Sum<A, Void>;
// 同构于 A

// A × 0 = 0（任何类型与 Void 的 Product 是 Void）
// type PairWithVoid<A> = Pair<A, Void>;
// 无法构造这个类型的值！

// 分配律：A × (B + C) = (A × B) + (A × C)
type Distributive<A, B, C> = Pair<A, Sum<B, C>>;
type DistributedForm<A, B, C> = Sum<Pair<A, B>, Pair<A, C>>;

// 这两个类型是同构的！可以相互转换
const distribute = <A, B, C>(p: Distributive<A, B, C>): DistributedForm<A, B, C> => {
  if (p.second.tag === "Left") {
    return { tag: "Left", value: { first: p.first, second: p.second.value } };
  }
  return { tag: "Right", value: { first: p.first, second: p.second.value } };
};

const undistribute = <A, B, C>(d: DistributedForm<A, B, C>): Distributive<A, B, C> => {
  if (d.tag === "Left") {
    return { first: d.value.first, second: { tag: "Left", value: d.value.second } };
  }
  return { first: d.value.first, second: { tag: "Right", value: d.value.second } };
};

console.log("分配律验证:");
const testDist: Distributive<number, string, boolean> = {
  first: 42,
  second: { tag: "Left", value: "hello" }
};
const distributed = distribute(testDist);
const back = undistribute(distributed);
console.log("  原始:", testDist);
console.log("  分配后:", distributed);
console.log("  恢复:", back);

// ============================================================================
// 实际应用：常见的 Coproduct 模式
// ============================================================================

console.log("\n=== 常见的 Coproduct 模式 ===");

// 1. Maybe = 1 + A
// Nothing 对应 Unit（1），Just 对应 A
type MaybeAsCoproduct<A> = Sum<Unit, A>;

const nothing: MaybeAsCoproduct<number> = { tag: "Left", value: { tag: "Unit" } };
const just42: MaybeAsCoproduct<number> = { tag: "Right", value: 42 };

console.log("Maybe as Coproduct:");
console.log("  Nothing:", nothing);
console.log("  Just(42):", just42);

// 2. Either = A + B
// 已经是标准的 Coproduct 形式

// 3. List = 1 + (A × List)
// Nil 对应 Unit（1），Cons 对应 A × List（递归）
// 注意：TypeScript 的类型别名不支持直接递归，实际应该用 interface
// type ListAsCoproduct<A> = Sum<Unit, Pair<A, ListAsCoproduct<A>>>;

// 4. Bool = 1 + 1
// True 和 False 都是 Unit
type BoolAsCoproduct = Sum<Unit, Unit>;

const trueBool: BoolAsCoproduct = { tag: "Left", value: { tag: "Unit" } };
const falseBool: BoolAsCoproduct = { tag: "Right", value: { tag: "Unit" } };

console.log("Bool as Coproduct:");
console.log("  True:", trueBool);
console.log("  False:", falseBool);

// 5. 多个选项：A + B + C = (A + B) + C = A + (B + C)
// 结合律成立！（类型示例，未使用但展示概念）
// type Three<A, B, C> = Sum<A, Sum<B, C>>;
// type ThreeAlt<A, B, C> = Sum<Sum<A, B>, C>;

/**
 * 总结：Tagged Union 在范畴论中的地位
 * 
 * 1. Tagged Union = Coproduct（余积）= Sum Type（和类型）
 *    - 表示"或"的逻辑
 *    - 代数运算：加法
 * 
 * 2. 与 Product 的对偶关系
 *    - Product = Tuple/Record（积类型）= "与"的逻辑
 *    - 代数运算：乘法
 * 
 * 3. 泛性质
 *    - Product: 投影函数 fst/snd
 *    - Coproduct: 注入函数 inl/inr + 模式匹配
 * 
 * 4. 代数数据类型（ADT）
 *    - 遵循代数规则（加法、乘法、分配律）
 *    - 类型大小可以计算
 *    - 同构关系可以证明
 * 
 * 5. 实际应用
 *    - Maybe = 1 + A（可选值）
 *    - Either = A + B（二选一）
 *    - List = 1 + (A × List)（递归定义）
 *    - 枚举类型（多个 Unit 的 Coproduct）
 * 
 * 6. 在函数式编程中的重要性
 *    - Product + Coproduct = 代数数据类型的基础
 *    - 可以组合出任意复杂的数据结构
 *    - 类型安全的模式匹配
 *    - 编译器可以检查完备性
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
