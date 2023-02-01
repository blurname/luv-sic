/// <reference types="node" resolution-mode="require"/>
import { exec } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { stat, access, rename } from 'node:fs/promises';
declare const pExec: typeof exec.__promisify__;
declare const pSpawn: (arg1: string, arg2: readonly string[], arg3: import("child_process").SpawnOptions) => Promise<unknown>;
export { pExec as exec, pSpawn, stat, access, rename, writeFile };
//# sourceMappingURL=core.d.ts.map