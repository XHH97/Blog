function BigIntAdd(number1, number2) {
  let number1Str = '', number2Str = '', add = 0, a = 0, addStr = '';
  number1Str = number1 + '';
  number2Str = number2 + '';
  let maxLen = Math.max(number1Str.length, number2Str.length);
  number1Str = number1Str.padStart(maxLen, '0');
  number2Str = number2Str.padStart(maxLen, '0');
  for (let i = maxLen - 1; i >= 0; --i) {
    let addNumber = Number(number1Str[i]) + Number(number2Str[i]);
    if (i === 0) {
      addStr = `${addNumber + a}${addStr}`;
      break;
    }
    if (addNumber + a >= 10) {
      add = (addNumber + a) % 10;
      addStr = `${add}${addStr}`;
      a = 1;
      continue;
    }
    addStr = `${addNumber + a}${addStr}`;
    a = 0;
  }
}