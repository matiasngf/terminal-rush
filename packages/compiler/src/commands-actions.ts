
import chalk from 'chalk';
import { Logger } from './debugger';
import { RushCompiler } from './compiler';

export const dev = (debug: boolean) => {

  Logger.setDebugMode(debug);

  const compiler = new RushCompiler({
    dev: true,
    watch: true,
    compilerDir: '.rush-compiler',

    onStart: (_err, _stats) => {
      console.log(`${chalk.green('rush-compiler')} compiling`);
    }
  })

  console.log(`${chalk.yellow('rush-compiler')} starting dev mode...`);
  compiler.start()

}

export const build = (debug: boolean) => {

  Logger.setDebugMode(debug);

  const compiler = new RushCompiler({
    dev: false,
    watch: false,
    compilerDir: '.rush-compiler',

    onStart: (_err, _stats) => {
      console.log(`${chalk.green('rush-compiler')} compiling`);
    }
  })

  console.log(`${chalk.yellow('rush-compiler')} starting build`);
  compiler.start()

}
