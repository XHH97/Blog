self.addEventListener('message', (value) => {
  console.log(value.data);
  console.log(self === globalThis);
});