// https://leetcode.cn/problems/24-game/description/
// 1. 问题翻译：给定 4 个数字，判断通过四则运算能否获得 24 点，若能计算成功，给出对应计算表达式
//   1. 问题1: 如何判断 24 点
//   2. 问题2: 如何给出计算表达式
// 2. 解答：
//   设 4 个数字在挑选时的代号为 n1, n2, n3 ,n4
//   问题1:
//     1. 我们会确定第1个数字 n1, 然后从剩下3个数字中选取1个 n2 进行四则运算 compute, 得到 res1; res1 = compute(n1,n2)
//     2. res1 需要对下一个数字 n3x 进行运算，此时有两种可能性，
//      1) n3x 为入参数字 n3 or n4
//        n3x = n3 ,res1 与 n3x 运算，再与 n4 进行运算
//        res2 = compute(compute(res1,n3x),n4)
//
//        res = compute(compute(compute(n1,n2),n3),n4)
//      2) n3x 为 n3 and n4 的计算组合
//        n3x = compute(n3,n4), res2 = compute(res1,n3x) -> compute(res1,compute(n3,n4))
//
//        res = compute(compute(n1,n2),compute(n3,n4))
//     疑问：第1个数字固定，跑一遍; 第1个数字不固定，跑四遍；它们的结果一样吗?试一试，如果测试结果一样，如何证明其正确性

// my code
const compute = (a:number, b:number) => {
  return {
    addRes: a + b,
    minusRes: a - b,
    timeRes: a * b,
    divRes: a / b
  }
}
// TODO: bl:
// 1. 搜索结构
// 2. 计算结构

const TARGET = 24
const resolve = (numberList:[number, number, number, number]) => {
  try {
    for (let x = 0; x < numberList.length; x++) {
      const n1 = numberList[x]
      for (let y = 0; y < numberList.length; y++) {
        if (y === x) continue
        const n2 = numberList[y]
        const res1 = compute(n1, n2)

        for (let z = 0; z < numberList.length; z++) {
          if (z === y || z === x) continue
          const n3 = numberList[z]
          const n4 = numberList.filter((n, index) => index !== x && index !== y && index !== z)[0]
          { // n3x path1
            for (const res1Res of Object.values(res1)) {
              const res2 = compute(res1Res, n3)
              for (const res2Res of Object.values(res2)) {
                const res3 = compute(res2Res, n4)
                for (const res3Res of Object.values(res3)) {
                  if (res3Res === TARGET) throw new Error(`true: ${n1},${n2},${n3},${n4}`)
                }
              }
            }
          }
          { // n3x path2
            // const [n3, n4] = numberList.filter(n => n !== x && n !== y)
            const res2 = compute(n3, n4)
            for (const res1Res of Object.values(res1)) {
              for (const res2Res of Object.values(res2)) {
                const res3 = compute(res1Res, res2Res)
                for (const res3Res of Object.values(res3)) {
                  if (res3Res === TARGET) throw new Error(`true: ${n1},${n2},${n3},${n4}`)
                }
              }
            }
          // res1 = n3 * n4
          }
        }
      }
    }
    throw new Error('false')
  } catch (e) {
    console.log(e.message)
  }
}
resolve([1, 2, 3, 4])

resolve([5, 5, 5, 5])

resolve([6, 6, 6, 6])

resolve([3, 3, 7, 7])

resolve([1, 4, 7, 9])
