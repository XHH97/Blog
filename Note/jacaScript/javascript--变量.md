# 变量
## 这就是javaScript中的变量
ECMA-262的表述是javaScript变量与其他编程语言的变量有着很大的区别，javaScript的变量是
松散的，这个本质也就决定变量他只是在特定时间存放特定值的名称而已。由于他不会向其他语言
受变量必须要保存何种数据类型的值的约束。所以它的变量可以在脚本的生命周期更改变量值以及
变量的类型。
```js
var num = 1; //Number
console.log(typeof num);
num = '2'; // String
console.log(typeof num);
num = true; // 布尔值
console.log(typeof num); 

//代码一 变量本质
```
上述代码可以说明了javaScript变量本质。会发现在变量名的前面不需要像C、C++一样要在前面就
要确定变量的数据类型，而且它会在生命周期中更改变量的数据类型。这就是一个松散的javaScript
变量。

## 基本类型(原始值)和引用类型
在ECMAscript中包含了两种不同的数据类型：基本类型与引用类型

基本类型：保存在变量对象中（作用域会说明），能够操作保存在变量中实际的值，包括了5种基本数据类型String,Number,Boolean,Undefined,Null(ES6中新加的Sybmol).,它们是按值进行访问的。

引用类型：是保存在内存中(堆内存)的对象。由于javaScript不能够直接访问内存中的位置，也就是说不能直接操作对象的内存空间。也就说我们在操作对象的时候，实际上操作的不是对象本身而是指向对象内存空间的一个地址引用。

动态创建属性适用于基本类型与引用类型。只不过对于基本类型来说创建属性的过程就相当于销毁这个属性。
```js
var name = 'xuhh';
name.age = 22;  // 22  不过在这里这个属性会被立即销毁掉
console.log(name.age);  // undefined

// 代码二  基本类型创建属性
```

而引用类型创建属性时会将这个属性保存到这个变量中，只要这个变量或是这个属性不被销毁他就会一直保存下去。
```js
var obj = {};  // 创建一个空对象
obj.name = 'xuhh'; //添加一个name属性
console.log(obj.name);  // 'xuhh'  说明属性保存下来了

// 代码三  引用类型创建属性
```
## 关于变量复制与参数的传递
 >在介绍变量复制之前，需要补充一些东西：基本类型(原始值)是不可变的，引用类型是可变的。（用一个例子来进行解释吧，详细的可以去参照javaScript权威指南上的解释）
 ```js
 // 原始值
 var name = 'xuhh';  // 创建一个变量，值为原始值
 name.toLocaleUpperCase(); // 改变变量的值  值改成大写的
 console.log(name);  // 'xuhh'  值没有发生改变

 // 对象引用
 var obj = {
   name: 'xuhh'
 }  // 创建一个变量，值为引用类型
 obj.name = 'stone'; //改变变量值
 console.log(obj.name);  // 'stone'  发生了改变

 // 代码四 基本类型(原始值)是不可变的，引用类型是可变的
 ```
### 变量复制
基本类型：在进行复制的时候，会在变量对象上创建一个新值（或是说分配了一个新的地址），然后把该值复制到新变量分配的位置上。并且这两个变量可以参与到任何操作中不相互影响。
```js
let num1 = 5;
let num2 = num1; //5
num1 = 6 // 改变num1的值

console.log(num1);  // 6
console.log(num2);  // 5

// 代码五 没有相互影响。
```
引用类型：在进行复制的时候同样会在内存中创建新值，并为这个新变量分配一个空间(地址)。但是由于由于javaScript不能够直接访问内存中的位置，也就是说不能直接操作对象的内存空间。所以这个值的副本其实是一个指针，这个指针指向的是存储在堆内存中的这个对象。因此改变一个变量就会影响到另一个变量。
```js
let obj1 = {
	name = 'xuhh'
}    // 创建一个变量
let obj2 = obj1;   // 将obj1复制给obj2   这里复制过来的是一个指针，指向的是这个对象。
obj1.value = 10 ;
console.log(obj1):  // {name: 'xuhh', value: 10}
console.log(obj2):  // {name: 'xuhh', value: 10}  // 影响到了obj2中的值

// 代码五 相互影响。
```

### 参数传递
> 参数传递是一个有趣的东西。我也不知道自己能不能说清楚，感觉现在还是一知半解的。希望能够在这里好好的整理一下（待更 需要一定时间来消化看的东西以及实际的操作）
在这里推荐一篇文章[JavaScript深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)大家可以去看看冴羽大大的这篇文章

高级程序设计底4.1.3中有这么几段话：
>ECMAScript中的所有函数的参数都是按值传递的。也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。基本类型变量如同基本类型变量的复制一样；引用类型值的传递，则如同引用类型变量的复制一样。
>这里有一个误解：就是在局部作用域中修改的对象会在全局作用域中反应出来，就说明参数是按引用传递的。（然而你不知道还有最终共享传递也会有这种效果）。
[传递的三种方式](https://github.com/XUXHH/Blog/blob/master/Note/jacaScript/%E4%BC%A0%E9%80%92%E7%9A%84%E4%B8%89%E7%A7%8D%E6%96%B9%E5%BC%8F.md)


## 检测类型
### typeof
>[typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)操作符返回的是一个字符串，表示未经计算的操作数的类型。
使用：typrof 需要检测的类型
上代码
```js
let num = 1, str = 'string', boolean = true, undefineds = undefined, nulls = null, symbol = Symbol('symbol'); // 定义了六个基本类型变量 symbol(ES6新增)
let obj = {}, fun = function() {}, date = new Date(), reg = /\w/g, arr = [];  // 定义了常见的引用类型变量

typeof num; // 'number'
typeof str; // 'string'
typeof boolean; // 'boolean'
typeof undefineds; // 'undefined'
typeof nulls; // 'object'  奇怪的家伙  后面注解会进行初略的解释
typeof symbol; // 'symbol'

typeof obj; // 'object'
typeof fun; // 'function'
typeof date; // 'object'
typeof reg; // 'object'
typeof arr; // 'object'
```

使用场景：适用于判断基本类型（null除外），不适用于判断引用类型（function除外）。
### instanceof
>[instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)运算符是用来测试一个 对象 在其原型链中是否存在一个构造函数的prototypr属性  返回boolean值
使用：要检测的类型 instanceof 需要判断的类型构造函数
```js
// 在定义一次  好傻的操作
let num = 1, str = 'string', boolean = true, symbol = Symbol('symbol'); // 定义了六个基本类型变量 symbol(ES6新增)
let obj = {}, fun = function() {}, date = new Date(), reg = /\w/g, arr = [];  // 定义了常见的引用类型变量

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
使用场景：定义说的蛮清楚了是用来检测对象的，不适用来检测基本类型。
### Object.prototype.toString.call()
>可以通过[toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 来获取每个对象的类型。为了每个对象都能通过 Object.prototype.toString() 来检测，需要以 Function.prototype.call() 或者 Function.prototype.apply() 的形式来调用，传递要检查的对象作为第一个参数   返回一个字符串

```js
// 傻操作又出现了 （笑哭）
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
使用场景：可以再用来检测基本类型与引用类型。
### 注解：
javaScript是一门动态的弱类型编程语言。
如何判断一门语言是否是类型的？

如果一门编程语言支持隐式类型转换：弱类型
```js
// 例如javaScript
let str = '0';
let num = str - 0;
console.log(typeof str); // string
console.log(typeof num); // number

// 代码六 不会爆语法错误  支持隐式类型转换
```

如果一门编程语言不支持隐式类型转换：强类型
```python
# 例如python
num = 1000  # number
str = '0' + num # TypeError: cannot concatenate 'str' and 'int' objects  语法错误

# 代码七  会报语法错误  说明不支持隐式类型转换
```

动态和静态编程语言？
 >动态类型语言：在运行期间才做数据类型检查的语言，不需要给变量指定数据类型，会在第一次赋值给变量时，在内部将数据类型记录下来。    例如：javaScript，python;

 >静态类型语言：在编译时期间就要检查数据类型，需要给变量指定数据类型。  例如：C,C++

为什么使用typeof检测null 会是‘object’？

[关于null的详细解释](http://2ality.com/2013/10/typeof-null.html)

首先我们要承认 null 是一个bug，一个有趣的bug，并且这个bug官方说不回去修复，会保留下来。因为修改的话会造成许多的代码错误，这个错误在
第一版的ecmascript中就已经出现了，在这个版本中值是以32位为单位进行存储的。这个值是由一个累心标签（1-3位）和该值的实际数据数据组成，
类型标签存储在单元的低位中

null可以理解成是一个空指针，而空指针在大多数的变成语言中都是0x00,也就是为零，而在类型标签中000 时表示为 object
所以载typeof是会将null 判定为object









首先我们要承认 null 是一个bug，一个有趣的bug，并且这个bug官方说不回去修复，会保留下来。因为修改的话会造成许多的代码错误，这个错误在
第一版的ecmascript中就已经出现了，在这个版本中值是以32位为单位进行存储的。这个值是由一个累心标签（1-3位）和该值的实际数据数据组成，
类型标签存储在单元的低位中，分别有五个:

          000: object   数据是对对象的引用

          1  : int      数据是一个31位有符号的整数

          010: double   数据是对双精度浮点数的引用

          100: string   数据是对字符串的引用

          110: boolean  数据是一个布尔值

通过上述的罗列可以发现最低位是一个，标签类型也是一位长，或者说它是零的话，那么位长是三位，为四中类型提供了两个附加位。

有两个异类：
  undefined：是整数-2^30(是整数之外的数值)
  null:可以理解成是一个空指针或是一个对象类型加上一个为零的引用  （后面那句话需要琢磨一下）
由于大多数的编程语言null指针都是0x00(代表0)，所以会被判定为'object'