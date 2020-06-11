# JavaScript基础 - 值
> 首先我们需要明确一个概念，在 JavaScript 中变量是没有类型的，只有值才有。变量只不过是一个值的一个标识符，用于访问保存这个值的标识符。

这一篇文章你可以当做是 [JavaScript基础 - 数据类型](./JavaScript基础%20-%20数据类型.md) 的扩展阅读，更加详细的介绍了几大类型。

## 基本类型值和引用类型值
> 在 JavaScript 中我们可以将值分为两大类: **基本类型**（原始值）和**引用类型**（Object），这两种类型的值在使用上也存在一定的区别。

### 基本类型值（原始值）
基本类型值（原始值）包含了7个基本类型。undefined, null, number, string, boolean, symbol, bigint 这7种。

#### undefined && null
很多人会将 undefined 与 null 两种类型值的含义混淆，我们就先来认识一下这两个类型值。undefined 和 null 是两个比较特殊的值，并且它们都只有一个值。
在 JavaScript 中 undefined 和 null 通常会用来表示‘空的’值或是‘不是值’的值。但是它们还是有细微的区别的：
- undefined - 指没有值
- null - 指空值
或是
- undefined - 表示从未赋值
- null - 表示之前赋过值，但目前没有值
null 在 JavaScript 中是一个关键词，而 undefined 并不是一个关键，而是全局对象中的一个属性。并且在使用 undefined 还是有一定的风险的，JavaScript 的社区中提议使用 void 0 来取代 undefined。在非严格模式下我们是能够更改 undefined 所表示的值。

```js
// globalThis.undefined 属性
console.log(window.undefined); //   undefined

// 修改 undefined 所表示的值
function func() {
  var undefined = 10;
  console.log(undefined);  // 10
}

// 使用 void 0 代替 undefined
let undefined_value = void 0;
console.log(undefined_value);  // undefined
```

#### number
在 JavaScript 中只有一种数字类型，number（数字），它是包含了“整数”和浮点数的十进制数，在 JavaScript 中是没有真正意义上的整数的，例如 42.0 会等于 （整数）42。

JavaScript 与大多数现代编程语言一样都是基于 [IEEE-754 标准](https://zh.wikipedia.org/zh-hans/IEEE_754)来实现的，该标准也是运用最广泛的浮点数标准。JavaScript 运用的是“双精度”（64位二进制）。

在 JavaScript 中number（数字）也是有有精度限制的，“整数”的最大值与最小值分别为 `Number.MAX_VALUE` 和 `Number.MIN_VALUE`。但是我们实际能够安全显示的值为 `2^53-1`（最大数） 和 `-2^52-1`（最小数） 用数字表示就是 `9007199254740991` 和 `-9007199254740991`，如果操作实际能够安全显示数值就会导致精度错误，从而导致运算错误。

在 JavaScript 中有几个比较特殊的值：
- 0 和 -0
- Infinity （正无穷，超过 Number.MAX_VALUE 的值）
- -Infinity （负无穷，超过 Number.MIN_VALUE 的值）
- NaN （警戒值，用于指出数字类型中的错误情况，且 NaN 是一个非常极端的值，如果你要判断一个值是否为 NaN，无法使用使用 === 等式来进行判断，还需要使用 Number.isNaN 方法来进行判断）

#### string


#### boolean
JavaScript 中的 boolean（布尔值）就只有两个值：true 和 false，且 true 和 false 都是关键词。boolean 通常是表示逻辑判断上的真假值。

#### Symbol


#### BigInt


### 引用类型值（Object）


#### Object

#### Array

## 不可变的原始值和可变的引用值
在 JavaScript 中原始值是无法进行变化的

## 值传递


## 扩展阅读
- [MDN - 数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)
- 《JavaScript权威指南》
- 《JavaScript高级程序设计指南》
- 《你不知道的 JavaScript 中卷》
- [冴羽 - JavaScript深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)