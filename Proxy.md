# Proxy

> 以下内容是通过 GPT 获取的，作为记录使用
> Proxy是ES6引入的新特性，它可以用来创建一个对象的代理，从而能够拦截和定义基本操作的行为，如属性查找、赋值、枚举、函数调用等。以下是一些Proxy的使用场景：

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## 使用场景

### 数据绑定和监听

> Proxy可以用来监听对象的改变，实现数据绑定，这是Vue.js等框架的基础。

```js

let data = { name: 'CursorBot' };
let p = new Proxy(data, {
    set(target, property, value) {
        console.log(`Property ${property} is set to ${value}`);
        target[property] = value;
    }
});

p.name = 'GPT-4'; // 输出：Property name is set to GPT-4

```

### 数据校验

> Proxy可以用来对对象的读写进行校验。

```js
let data = { age: 25 };
let validator = {
    set: function(obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('Age is always an integer');
            }
            if (value < 0 || value > 200) {
                throw new RangeError('Age seems invalid');
            }
        }
        obj[prop] = value;
    }
};

let p = new Proxy(data, validator);
p.age = 100; // OK
p.age = 'old'; // Throws an exception
p.age = 300; // Throws an exception
```

### 智能化操作

> Proxy可以用来实现一些智能化的操作，比如默认值、隐藏属性等。

```js
let handler = {
    get: function(target, name) {
        return name in target ? target[name] : 42;
    }
};

let p = new Proxy({}, handler);
p.a = 1;
console.log(p.a, p.b); // 1, 42
```

## 业务场景

### API接口的模拟和调试

> 在前端开发中，有时后端的API接口还没有准备好，这时可以使用Proxy来模拟API接口。或者在调试阶段，可以使用Proxy来拦截API请求，查看或修改请求和响应数据。

以下代码在其他请求库也是同样适用的，不过需要看看 ajax 怎么使用

```js

// 创建一个代理
let handler = {
    apply(target, thisArg, argumentsList) {
        let url = argumentsList[0];

        // 根据不同的URL返回不同的模拟数据
        if (url.includes('/api/user')) {
            return Promise.resolve(new Response(JSON.stringify({ id: 1, name: 'CursorBot' })));
        } else if (url.includes('/api/posts')) {
            return Promise.resolve(new Response(JSON.stringify([{ id: 1, title: 'Hello, world!' }])));
        }

        // 对于其他URL，调用原始函数
        return target.apply(thisArg, argumentsList);
    }
};

// 使用代理替换原始函数
const newFetch = new Proxy(globalThis.fetch, handler);

// 使用方式
newFetch('/api/user')
    .then(response => response.json())
    .then(data => console.log(data)); // 输出：{ id: 1, name: 'CursorBot' }

newFetch('/api/posts')
    .then(response => response.json())
    .then(data => console.log(data)); // 输出：[{ id: 1, title: 'Hello, world!' }]

```

### 性能优化

> 在处理大量数据时，可以使用Proxy来实现惰性加载（lazy loading），只有当数据被实际访问时，才去获取或计算数据。

**需要注意的是，虽然Proxy可以用于性能优化，但它本身也有一定的性能开销。在使用Proxy时，你应该权衡其带来的好处和性能开销，确保优化是有效的。**

#### 惰性加载

> 惰性加载是一种编程技术，它将一些工作推迟到真正需要的时候才执行。这样可以提高应用程序的性能，并减少计算机资源的使用。

以下代码实现了运算结果缓存

```js
function createLazyObject(obj) {
    const cache = {};
    return new Proxy(obj, {
        get(target, property) {
            if (!(property in cache)) {
                console.log(`Calculating value for ${property}`);
                cache[property] = target[property]();
            }
            return cache[property];
        }
    });
}

let obj = {
    heavyCalculation() {
        // 假设这是一个需要大量计算的函数
        return Math.random();
    }
};

let lazyObj = createLazyObject(obj);

console.log(lazyObj.heavyCalculation); // 输出：Calculating value for heavyCalculation，然后输出计算结果
console.log(lazyObj.heavyCalculation); // 直接输出计算结果，不再进行计算
```

以下代码是图床的Proxy版本

```js
function createLazyImage(src) {
    let img = new Image();
    img.src = 'loading.gif'; // 显示一个加载中的GIF图

    let p = new Proxy(img, {
        set(target, property, value) {
            if (property === 'src') {
                target.src = 'loading.gif';
                let img = new Image();
                img.onload = () => target.src = value;
                img.src = value;
            } else {
                target[property] = value;
            }
        }
    });

    p.src = src;
    return p;
}

// 图片URL列表
let imageUrls = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

// 对每个图片URL创建一个惰性加载的图片元素
let images = imageUrls.map(createLazyImage);

// 将图片元素添加到页面上
images.forEach(img => document.body.appendChild(img));
```

#### 缓存

> Proxy可以用来实现各种缓存策略，例如最近最少使用（LRU）缓存、最近最常使用（LFU）缓存等。当数据的获取或计算成本很高时，缓存可以显著提高性能。

#### 虚拟化

> 在处理大量数据时，Proxy可以用来实现数据的虚拟化。例如，你可以创建一个代理，它只保存部分数据，当需要访问其他数据时，再去获取或计算。这可以减少内存的使用，提高性能。

#### 防抖和节流

> Proxy可以用来实现防抖和节流函数，这对于优化事件处理器非常有用。防抖函数可以合并在短时间内连续触发的事件，节流函数可以限制事件的触发频率。

#### 预加载和预计算

> Proxy可以用来实现数据的预加载和预计算。当你知道将来可能会需要某些数据时，你可以在后台提前加载或计算这些数据。这可以减少用户的等待时间，提高用户体验。

### 权限控制

> 可以使用Proxy来控制对某些敏感属性的访问，只有满足特定条件（如具有特定权限）的代码，才能访问这些属性。

### 数据保护

> 可以使用Proxy来创建一个对象的只读视图，防止对象被意外修改。
