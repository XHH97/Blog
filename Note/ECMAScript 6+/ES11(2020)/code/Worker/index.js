var myWorker = new Worker('worker.js');

myWorker.postMessage('value', (value) => {
  console.log(value + '接收');
})