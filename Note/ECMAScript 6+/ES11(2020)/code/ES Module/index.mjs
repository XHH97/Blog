// import.meta
const data = import.meta;
console.log(data);   // 一个对象 {url: ''}

const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result.status)))
  .catch((err)=> {
    console.log(object);
  });

// 动态 import
async function func() {
  const { NUMBER } = await import('./module.js');
  const value = await Promise.allSettled(promises);
  console.log(value);
  console.log(NUMBER); // 10
}

func();

