const { url } = import.meta;
const params = new URL(url).searchParams;

let keys = params.entries();

for (const key of keys) {
  console.log(key);
}