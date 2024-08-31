import {readFileSync} from 'node:fs';
import {compile} from './compile';

const [_node, _thisFile, ...args] = process.argv;
const code = readFileSync(args[args.length - 1] ?? '/dev/stdin').toString();
const jsCode = compile(code);
eval(jsCode);
