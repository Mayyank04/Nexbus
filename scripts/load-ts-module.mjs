/**
 * Cross-Node.js TypeScript Module Loader Utility
 * 
 * Enables seamless, deterministic loading of TypeScript modules across all
 * supported Node.js versions (Node.js 20.x, 22.x, 24+).
 * 
 * In-memory transpilation via the project's installed TypeScript compiler
 * converts .ts files to standard ES modules, avoiding Node.js version-specific
 * experimental flags, warnings, or ERR_UNKNOWN_FILE_EXTENSION errors.
 */

import fs from 'node:fs';
import path from 'node:path';

export async function loadTsModule(modulePath) {
  const resolvedPath = path.isAbsolute(modulePath)
    ? modulePath
    : path.resolve(process.cwd(), modulePath);

  if (resolvedPath.endsWith('.ts') || resolvedPath.endsWith('.tsx')) {
    const ts = (await import('typescript')).default;
    const code = fs.readFileSync(resolvedPath, 'utf8');
    const transpiled = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    });
    const base64 = Buffer.from(transpiled.outputText).toString('base64');
    return await import(`data:text/javascript;base64,${base64}`);
  }

  return await import(modulePath);
}
