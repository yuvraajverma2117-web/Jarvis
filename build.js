import {cp,mkdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await rm(path.join(root,'dist'),{recursive:true,force:true});await mkdir(path.join(root,'dist'));await cp(path.join(root,'public'),path.join(root,'dist'),{recursive:true});console.log('Static PWA built in dist/. Optional AI still requires the Node backend.');
