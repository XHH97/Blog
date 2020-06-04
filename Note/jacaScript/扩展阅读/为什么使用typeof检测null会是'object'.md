# 为什么使用typeof检测null 会是‘object’？

首先我们要承认 null 是一个bug，一个有趣的bug，并且这个bug官方说不会去修复，会保留下来。因为修改的话会造成许多的代码错误，这个错误在第一版的 ECMAScript 中就已经出现了，在这个版本中值是以32位为单位进行存储的。这个值是由一个累心标签（1-3位）和该值的实际数据数据组成。

null 可以理解成是一个空指针，而空指针在大多数的变成语言中都是0x00，也就是为零，而在类型标签中 **000** 时表示为 object 所以 typeof 是会将 null 判定为 object。

类型标签存储在单元的低位中，分别有五个:

    000: object   数据是对对象的引用

    1  : int      数据是一个31位有符号的整数

    010: double   数据是对双精度浮点数的引用

    100: string   数据是对字符串的引用

    110: boolean  数据是一个布尔值

通过上述的罗列可以发现最低位是一个，标签类型也是一位长，或者说它是零的话，那么位长是三位，为四中类型提供了两个附加位。

## 两个例外
undefined：是整数-2^30(是整数之外的数值)
null:可以理解成是一个空指针或是一个对象类型加上一个为零的引用  （后面那句话需要琢磨一下）
由于大多数的编程语言null指针都是0x00(代表0)，所以会被判定为'object'

## 扩展阅读
- [关于null的详细解释](http://2ality.com/2013/10/typeof-null.html)
- [MDN typeod null](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#null)