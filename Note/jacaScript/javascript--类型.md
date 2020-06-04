# 类型
编程语言的类型几乎是学习一门编程语言的基础部分，在日常开发中都离不开**值的类型定义**。你或许听过一句话“**编程语言是互通的**”，真的就互通吗？其实也是不一定的，当你习惯使用弱类型（动态类型）语言进行开发时，这时候你再去学习一门强类型（静态类型）的编程语言时，你就会发现或多或少还是有区别的，这个区别可能体现在语言类型的数量上或是类型定义上。就拿 JavaScript 来说，有 **Symbol**(ES6)，**BigInt**(ES11) 这两个比较独特的语言类型。

## 什么是JavaScript的类型
首先我们先来看一下在 ECMA-262 中对 JavaScript 类型的解释是什么。[ECMA-262 v5.1](http://www.ecma-international.org/ecma-262/5.1/#sec-8)
> 本规范中的运算法则所操纵的值均有相应的类型。本节中定义了所有可能出现的类型。ECMAScript 类型又进一步细分为语言类型和规范类型。
> 
> ECMAScript 语言中所有的值都有一个对应的语言类型。ECMAScript 语言类型包括 **Undefined**, **Null**, **Boolean**, **String**, **Number**, **Symbol**(ES6), **BigInt**(ES11-阶段4) 和 Object。

通过规范我们可以大致了解到，**类型是值得内部特征，它定义了值得行为，以使其区别于其它值。**
> An ECMAScript language value is a value that is characterized by an ECMAScript language type. [最新的ESMA-262 标准中的解释](http://www.ecma-international.org/ecma-262/#sec-ecmascript-data-types-and-values)

## JavaScript的内置类型有哪些
> [MDN - JavaScript的数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

JavaScript内置的类型有8种：
- [undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined) (未定义)
- [null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null) (空值)
- [string](https://developer.mozilla.org/zh-CN/docs/Glossary/String) (字符串)
- [number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number) (数字)
- [boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean) (布尔值)
- [symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol) (符号)
- [bigint](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt) (大整数)
- [object](https://developer.mozilla.org/zh-CN/docs/Glossary/Object) (对象)

以上8中内置类型我们可以分为**基本类型**(除 object 以外的)和**引用类型**(object)。

看到这里你可能会有疑问，我们通过使用 typeof function 时会得到一个 'function'，那 function 是不是也是一个内置类型呢？
其实通过查阅[规范文档](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.1)我们可以知道 **Function 是 Object 的一个"子类型"。换一句话说 Function 就是一个能够 "可调用对象"，它有一个内部属性 [[Call]]，该属性使其可以被调用。** 

## 如何判断一个值的类型
> 由于 JavaScript 是一门动态的弱类型编程语言，它不像一些强类型的编程语言，在编译阶段就对值指定数据类型，JavaScript 值的数据类型是在运行时进行定义的，也就是说在代码运行的时候是可以更改值的数据类型，所以我们无法完全确定一个值的数据类型是否在运行阶段被更改了。这时候我们就需要对值进行类型判断了。

在 JavaScript 中我们通常有三种方式类判断一个值的类型:
* typeof --- 主要用来判断是否是基本类型，**null是个例外**
* instanceof --- 主要用于判断应用类型
* Object.prototype.toString() --- 可以用于判断基本类型和引用类型

### typeof
> **typeof 运算符返回一个字符串**

以下的代码示例中列举了基本类型和一些引用类型，通过示例代码我们可以看到 **typeof 运算符在对 null 类型的值进行判断时候返回的并不是 null 而是 object，再对除 object，function 之外的引用类型进行判断的时候返回的都是 object。**

你肯定对 typeof null 返回的是 'object' 存在一定疑问吧，[扩展阅读](#扩展阅读)中进行阅读

```js
// primitive value
let primitive_string = 'string';
let primitive_number = 1;
let primitive_boolean = true;
let primitive_undefined = undefined;
let primitive_null = null;
let primitive_symbol = Symbol('str');
let primitive_bigint = 10000n;
// reference value
let reference_object = {};
let reference_function = ()=>{};
let reference_array = [];
let reference_data = new Data();
let reference_number = new Number();
let reference_regexp = /\d/g;

// primitive value 
typeof primitive_string   // string
typeof primitive_number   // number
typeof primitive_boolean  // boolean
typeof primitive_undefined  // undefined
typeof primitive_null   // object
typeof primitive_symbol   // symbol
typeof primitive_bigint   // bigint

// reference value
typeof reference_object   // object
typeof reference_function   // function
typeof reference_array    // object
typeof reference_data   // object
typeof reference_number   // object
typeof reference_regexp   // object
```

#### 安全防护机制
typeof 运算符是具有安全防护机制的，typeof 运算符总是能够返回一个字符串，就算是没有在作用域中定义过的变量它也能返回一个字符串(ES2015及之前)

##### typeof Undeclared
> **Undeclared 代表是还没有在作用中定义过的变量和 Undefined 所代表的的意义是完全不同的，请不要再混淆了**
```js
typeof primitive_undefined // undefined
typeof Undeclared // undefined
var primitive_undefined;
```

##### 报错
ES6中引入了块级作用域的 let 和 const 之后, 如果在其标识符之前使用 typeof 就会报错。**暂存死区(TDZ)**

```js
typeof str // ReferenceError
let str = 'str';
```

#### 例外
当前所有的浏览器都暴露了一个类型为 undefined 的非标准宿主对象 document.all。

```js
typeof document.all  // undefined
```

### instanceof
> instanceof 运算符用于检测**构造函数**的 `prototype` 属性是否出现某个**实例对象**的原型链中

instanceof 运算符主要是用于检测对象的，如果 instanceof 的左操作数是一个基本类型则会返回 false;

```js
let num = 1, str = 'string', boolean = true, symbol = Symbol('symbol'); // 定义了六个基本类型变量 symbol(ES6新增)
let obj = {}, fun = function() {}, date = new Date(), reg = /\w/g, arr = [];  // 定义了常见的引用类型变量

function Func() {
  this.name = 'xuhh';
}

Function.prototype.getName = function() {
  return this.name;
}

let func = new Func();

func instanceof Func  // true
func instanceof Object    // true
Func instanceof Function    // true

num instanceof Number; // false
str instanceof String; // false
boolean instanceof Boolean; // false
symbol instanceof Symbol; // false

obj instanceof Object; // true
fun instanceof Function; // true
date instanceof Date; // true
reg instanceof Regexp; // true
arr instanceof Array; // true

```

通过上面示例代码我们可以看到 instanceof 运算符是会沿着原型链一直向上进行查找，如果找到了就会返回 true 否者 false。

### Object.prototype.toString.call()
> Object.prototype.toString.call() 方法是用于对象类型检测的常用方式，它不仅能够检测基本类型，也能够检测出 Object，Function 以外的内置对象。
在使用 Object.prototype.toString.call() 检测其他对象类型时，我们需要改变其 `this` 的指向，所以我们需要用到 Function.prototype.call() 或是 Function.prototype.apply()  方法去更改 Object.prototype.toString() 方法的 `this` 指向。

```js
let num = 1, str = 'string', boolean = true, undefineds = undefined, nulls = null, symbol = Symbol('symbol'); // 定义了六个基本类型变量 symbol(ES6新增)
let obj = {}, fun = function() {}, date = new Date(), reg = /\w/g, arr = [];  // 定义了常见的引用类型变量

let toString = Object.prototype.toString;  // 减少一些代码
toString.call(num); // '[object Number]'
toString.call(str); // '[object String]'
toString.call(boolean); // '[object Boolean]'
toString.call(undefineds); // '[object Undefined]'
toString.call(nulls); // '[object Null]'
toString.call(symbol); // '[object Symbol]'
toString.call(obj); // '[object Object]'
toString.call(fun); // '[object Function]'
toString.call(date); // '[object Date]'
toString.call(reg); // '[object RegExp]'
toString.call(arr); // '[object Array]'

```

## 扩展阅读
- [如何何判断编程语言是否是静态还是动态的编程语言，强类型还是弱类型？](./扩展阅读/如何判断编程语言的类型.md)
- [为什么使用typeof检测null 会是‘object’？](./扩展阅读/为什么使用typeof检测null会是'object')
- 《你不知道的 JavaScript 中卷》
- [MDN - typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
- [MDN - instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
- [MDN - Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

## 待解决
1. [ ] 为什么 typeof function === 'function'
2. [ ] instalofce 深入研究
3. [ ] 加入标准进行解释