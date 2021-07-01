#!/usr/bin/env node
const { build, ts, tsconfig, glob, log } = require('estrella');

build({
  entry: glob('lib/**.ts'),
  outdir: 'dist',
  format: 'cjs',
  minify: false,
  tslint: true,
  onEnd(config) {
    generateTypeDefs(tsconfig(config), config.entry, config.outdir);
  },
})

function generateTypeDefs(tsconfig, entryfiles, outdir) {
  const filenames = Array.from(
    new Set(
      (Array.isArray(entryfiles) ? entryfiles : [entryfiles])
        .concat(tsconfig.include || []))).filter(v => v);

  log.info('Generating type declaration files');

  const compilerOptions = {
    ...tsconfig.compilerOptions,
    moduleResolution: undefined,
    declaration: true,
    outDir: outdir,
  };
  const program = ts.ts.createProgram(filenames, compilerOptions);
  const targetSourceFile = undefined;
  const writeFile = undefined;
  const cancellationToken = undefined;
  const emitOnlyDtsFiles = true;
  program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles);
}
