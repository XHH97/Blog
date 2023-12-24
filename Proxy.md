# Proxy

> 以下内容是通过 GPT 获取的，作为记录使用
> Proxy是ES6引入的新特性，它可以用来创建一个对象的代理，从而能够拦截和定义基本操作的行为，如属性查找、赋值、枚举、函数调用等。以下是一些Proxy的使用场景：

**在 Proxy 中最重要的就是 `set` 和 `get` 两个方式**, 可以通过这两个方式来实现以下的业务场景。

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

计算缓存

```js
function createCachedFunction(func) {
    const cache = {};

    return new Proxy(func, {
        apply(target, thisArg, argumentsList) {
            const cacheKey = JSON.stringify(argumentsList);
            if (!(cacheKey in cache)) {
                cache[cacheKey] = target.apply(thisArg, argumentsList);
            }
            return cache[cacheKey];
        }
    });
}

function expensiveCalculation(x, y) {
    // 假设这是一个需要大量计算的函数
    return x + y;
}

let cachedCalculation = createCachedFunction(expensiveCalculation);

console.log(cachedCalculation(1, 2)); // 计算结果并缓存
console.log(cachedCalculation(1, 2)); // 从缓存中获取结果，不再进行计算
```

实现 `最近最少使用（LRU）缓存`

```js
class LRUCache {
    constructor(capacity, func) {
        this.capacity = capacity;
        this.cache = new Map();
        this.func = func;
    }

    get(key) {
        if (this.cache.has(key)) {
            // 如果缓存中有这个键，将其移动到最后
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        } else {
            // 如果缓存中没有这个键，计算结果并添加到缓存中
            const value = this.func(key);
            this.cache.set(key, value);

            // 如果缓存的大小超过了容量，删除最旧的键
            if (this.cache.size > this.capacity) {
                const oldestKey = this.cache.keys().next().value;
                this.cache.delete(oldestKey);
            }

            return value;
        }
    }
}

function expensiveCalculation(x) {
    // 假设这是一个需要大量计算的函数
    return x * x;
}

let cache = new Proxy(new LRUCache(3, expensiveCalculation), {
    get(target, property) {
        return target.get.bind(target);
    }
});

console.log(cache(1)); // 计算结果并缓存
console.log(cache(2)); // 计算结果并缓存
console.log(cache(3)); // 计算结果并缓存
console.log(cache(1)); // 从缓存中获取结果，不再进行计算
console.log(cache(4)); // 计算结果并缓存，由于缓存的大小超过了容量，删除最旧的键（2）
console.log(cache(2)); // 重新计算结果并缓存
```

实现 `最近最常使用（Least Frequently Used，LFU）`

```js
class LFUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.frequencies = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            this.frequencies.set(key, (this.frequencies.get(key) || 0) + 1);
            return this.cache.get(key);
        }
        return null;
    }

    set(key, value) {
        while (this.cache.size >= this.capacity) {
            let leastFrequentlyUsedKey = this.getLeastFrequentlyUsedKey();
            this.cache.delete(leastFrequentlyUsedKey);
            this.frequencies.delete(leastFrequentlyUsedKey);
        }
        this.cache.set(key, value);
        this.frequencies.set(key, 1);
    }

    getLeastFrequentlyUsedKey() {
        return [...this.frequencies.entries()].reduce((a, b) => a[1] < b[1] ? a : b)[0];
    }
}

let cache = new Proxy(new LFUCache(3), {
    get(target, property) {
        return target[property].bind(target);
    }
});

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
cache.get('a');
cache.get('a');
cache.set('d', 4); // 'b' is removed because it is the least frequently used
console.log(cache.get('b')); // null
console.log(cache.get('a')); // 1
```

实现`数据预加载`

```js
function createPreloadProxy(imageLoader) {
    return new Proxy(imageLoader, {
        get(target, property) {
            const image = target[property];
            image.src = property;
            return image;
        }
    });
}

const imageLoader = {
    get image() {
        return new Image();
    }
};

const preloadedImageLoader = createPreloadProxy(imageLoader);

// 使用预加载的图片加载器
const img = preloadedImageLoader['image1.jpg'];
document.body.appendChild(img);
```

#### 虚拟化

> 在处理大量数据时，Proxy可以用来实现数据的虚拟化。例如，你可以创建一个代理，它只保存部分数据，当需要访问其他数据时，再去获取或计算。这可以减少内存的使用，提高性能。

```js
function createVirtualArray(length, calculateValue) {
    return new Proxy({}, {
        get(target, property) {
            let index = Number(property);
            if (index >= 0 && index < length) {
                if (!(property in target)) {
                    target[property] = calculateValue(index);
                }
                return target[property];
            } else {
                return undefined;
            }
        }
    });
}

let arr = createVirtualArray(1000000, i => i * i);

console.log(arr[123456]); // 输出：15241383936
```

实现 `虚拟文件系统`

```js
function createVirtualFileSystem() {
    const fs = {};

    return new Proxy(fs, {
        get(target, property) {
            if (!(property in target)) {
                target[property] = createVirtualFileSystem();
            }
            return target[property];
        }
    });
}

let fs = createVirtualFileSystem();

fs.home.user.documents = 'Hello, world!';
console.log(fs.home.user.documents); // 输出：Hello, world!
```

#### 防抖和节流

> Proxy可以用来实现防抖和节流函数，这对于优化事件处理器非常有用。防抖函数可以合并在短时间内连续触发的事件，节流函数可以限制事件的触发频率。

`。Proxy的主要用途是在访问或操作对象时添加额外的行为，例如数据验证、数据绑定、权限控制等。在这些例子中，我们只是简单地使用Proxy来调用防抖和节流函数，这并没有带来额外的好处。`
和不使用 Proxy 的版本并没有什么不同，且在性能上也没有什么大的区别。

Proxy版本

```js
/** 实现防抖函数 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

let debouncedFunc = new Proxy(debounce, {
    apply(target, thisArg, argumentsList) {
        return target.apply(thisArg, argumentsList);
    }
});

/** 实现节流函数 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func.apply(this, args);
    };
}

let throttledFunc = new Proxy(throttle, {
    apply(target, thisArg, argumentsList) {
        return target.apply(thisArg, argumentsList);
    }
});

// 使用方式
window.addEventListener('scroll', throttledFunc(() => console.log('Scrolled'), 100));
// 使用方式
window.addEventListener('resize', debouncedFunc(() => console.log('Resized'), 100));
```

不使用 Proxy 版本

```js
// 防抖函数
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// 节流函数
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func.apply(this, args);
    };
}

// 使用方式
window.addEventListener('scroll', throttle(() => console.log('Scrolled'), 100));
// 使用方式
window.addEventListener('resize', debounce(() => console.log('Resized'), 100));
```

#### 预加载和预计算

> Proxy可以用来实现数据的预加载和预计算。当你知道将来可能会需要某些数据时，你可以在后台提前加载或计算这些数据。这可以减少用户的等待时间，提高用户体验。

总体感觉与[惰性加载](#惰性加载)和[缓存](#缓存)的处理上并没有大的变动，都可以在上述的两种方式上进行修改得到

Proxy 实现数据预加载

```js
function createPreloadProxy(imageLoader) {
    return new Proxy(imageLoader, {
        get(target, property) {
            const image = target[property];
            image.src = property;
            return image;
        }
    });
}

const imageLoader = {
    get image() {
        return new Image();
    }
};

const preloadedImageLoader = createPreloadProxy(imageLoader);

// 使用预加载的图片加载器
const img = preloadedImageLoader['image1.jpg'];
document.body.appendChild(img);
```

Proxy 实现数据预计算

```js
function createPrecomputeProxy(func) {
    const cache = {};

    return new Proxy(func, {
        apply(target, thisArg, argumentsList) {
            const cacheKey = JSON.stringify(argumentsList);
            if (!(cacheKey in cache)) {
                cache[cacheKey] = target.apply(thisArg, argumentsList);
            }
            return cache[cacheKey];
        }
    });
}

function expensiveCalculation(x, y) {
    // 假设这是一个需要大量计算的函数
    return x + y;
}

let precomputedCalculation = createPrecomputeProxy(expensiveCalculation);

// 预计算结果并缓存
precomputedCalculation(1, 2);

// 从缓存中获取结果，不再进行计算
console.log(precomputedCalculation(1, 2)); 
```

### 权限控制

> 可以使用Proxy来控制对某些敏感属性的访问，只有满足特定条件（如具有特定权限）的代码，才能访问这些属性。

```js
function createProtectedObject(obj, permissions) {
    return new Proxy(obj, {
        get(target, property) {
            if (permissions[property]) {
                return target[property];
            } else {
                throw new Error(`Permission denied to access ${property}`);
            }
        },
        set(target, property, value) {
            if (permissions[property]) {
                target[property] = value;
            } else {
                throw new Error(`Permission denied to modify ${property}`);
            }
        }
    });
}

let obj = { secret: '123456' };
let permissions = { secret: false };

let protectedObj = createProtectedObject(obj, permissions);

console.log(protectedObj.secret); // Throws an error
protectedObj.secret = '654321'; // Throws an error
```

Proxy实现基于角色的权限控制

```js
function createRoleBasedObject(obj, roles) {
    return new Proxy(obj, {
        get(target, property) {
            if (roles.includes(property)) {
                return target[property];
            } else {
                throw new Error(`Permission denied to access ${property}`);
            }
        },
        set(target, property, value) {
            if (roles.includes(property)) {
                target[property] = value;
            } else {
                throw new Error(`Permission denied to modify ${property}`);
            }
        }
    });
}

let obj = { admin: '123456', user: '654321' };
let roles = ['user'];

let roleBasedObj = createRoleBasedObject(obj, roles);

console.log(roleBasedObj.user); // Outputs: 654321
console.log(roleBasedObj.admin); // Throws an error
roleBasedObj.user = '111111'; // Success
roleBasedObj.admin = '000000'; // Throws an error
```

### 数据保护

> 可以使用Proxy来创建一个对象的只读视图，防止对象被意外修改。

```js
function createProtectedData(data) {
    return new Proxy(data, {
        get(target, property) {
            if (typeof target[property] === 'function') {
                return target[property];
            } else {
                throw new Error(`Direct access to ${property} is not allowed`);
            }
        },
        set(target, property, value) {
            throw new Error(`Direct modification of ${property} is not allowed`);
        }
    });
}

let data = {
    secret: '123456',
    getSecret() {
        return this.secret;
    },
    setSecret(value) {
        this.secret = value;
    }
};

let protectedData = createProtectedData(data);

console.log(protectedData.getSecret()); // Outputs: 123456
protectedData.setSecret('654321'); // Success
console.log(protectedData.getSecret()); // Outputs: 654321
console.log(protectedData.secret); // Throws an error
protectedData.secret = '000000'; // Throws an error
```

Proxy实现数据加密和解密

```js
function createEncryptedData(data, secretKey) {
    return new Proxy(data, {
        get(target, property) {
            if (property in target) {
                return decrypt(target[property], secretKey);
            }
            return undefined;
        },
        set(target, property, value) {
            target[property] = encrypt(value, secretKey);
        }
    });
}

function encrypt(value, secretKey) {
    // 假设这是一个加密函数
    return value + secretKey;
}

function decrypt(value, secretKey) {
    // 假设这是一个解密函数
    return value - secretKey;
}

let data =
```
