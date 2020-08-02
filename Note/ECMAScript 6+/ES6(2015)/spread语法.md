# Spread(...) 语法
> 一般我们会在数组中使用这个方法（ES2018 能够在对象中进行使用），一般体现在展开和收集两个方式上。**只要是一个可迭代对象就能够使用**。

## 展开语法

对数组，字符串进行展开操作

```js
let arr = [1, 2, 3, 4, 5, 6];
console.log(...arr);      // 1, 2, 3, 4, 5, 6

let str = 'Hello';
console.log(...str);      // H e l l o

// 替代 concat() 方法
let arr1 = [7, 8, 9];
let arr2 = [...arr, ...arr1];

// 替代 apply 方法
function add(a, b, c) {
  return a + b + c;
}

let arr = [1, 2, 3, 4, 5];

console.log(add.apply(null, arr));
console.log(add(...arr));

```

## 收集语法
> 收集语法主要体现在函数的形参中, 会将传递进来的多个参数合并成一个数组，一般会在作为最后一个形参进行使用，**如果不是作为最后一个形参进行使用则会报错**。

```js
function func(...args) {
  console.log(args);    // [1, 2, 3, 4, 5]
}

func(1,2,3,4,5);

```

