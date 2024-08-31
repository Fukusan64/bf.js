const hasInput = (code: string) => code.includes(',');
const memory =
  'const m={d:[0],_p:0,get p(){return this._p},get c(){return this.d[this._p]},set c(data){this.d[this._p]=data&255},a(value){this._p+=value;const d=this._p-(this.d.length-1);if(d>0)this.d.push(...Array(Math.max(this.d.length+20,d)).fill(0))}};';
const input =
  "const fs=require('fs');const i=()=>{const b=Buffer.alloc(1);fs.readSync(0,b,0,1);m.c=b.readInt8(0)};";
const output =
  'const o=()=> process.stdout.write(String.fromCharCode(m.c));';

const optimize = (code: string) => code.replace(/\[1;-1;\]1;/g, 'R1;'); // reset

const parse = (code: string) => {
  const pureCode = code.replace(/[^+\-[\].,<>]/gim, '');
  const compressed = pureCode.replace(
    /(\++|-+|<+|>+|\[|\]|\.|,)/g,
    c => c[0] + c.length + ';'
  );
  const optimized = optimize(compressed);
  const splitted = optimized.split(';');
  splitted.pop();
  return splitted;
};

export const compile = (code: string) => {
  let result = '';
  result += memory;
  result += output;
  if (hasInput(code)) result += input;

  const map: Record<string, (count: number) => string> = {
    '+': (count: number) => `m.c+=${count};`,
    '-': (count: number) => `m.c-=${count};`,
    '[': (_count: number) => 'while(m.c){',
    ']': (_count: number) => '}',
    '.': (_count: number) => 'o();',
    ',': (_count: number) => 'i();',
    '<': (count: number) => `m.a(-${count});`,
    '>': (count: number) => `m.a(${count});`,
    'R': (_count: number) => 'm.c=0;',
  };

  for (const [op, ...tmp] of parse(code)) result += map[op](Number(tmp.join('')));
  return result;
};
