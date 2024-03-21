import chokidar from 'chokidar';
import { Compiler as WebpackCompiler, Stats as WebpackStats, webpack } from 'webpack';
import * as fs from 'fs';
import { deleteSync } from 'del'
import { generateWebpackConfig } from './generateWebpackConfig';
import { parseRoutes } from './parseRoutes';
import { generateAppCode } from './generateAppCode';

export interface CompilerOptions {
  dev: boolean;
  watch: boolean;
  compilerDir?: string;
  onStart?: (error: Error, stats: WebpackStats) => void;
}

export class RushCompiler {
  /** Is the compiler in dev mode */
  public dev: boolean;
  /** Is the compiler watching for changes */
  public watch: boolean;
  /** A directory used by the compiler to output custom files */
  public compilerDir: string;
  /** Where to output the dist files */
  public outputDir: string;
  /** Callback to be called when the compiler starts */
  private onStartOption?: (error: Error, stats: WebpackStats) => void;
  /** The webpack instance */
  public webpackInstance?: WebpackCompiler = undefined;
  /** Is the compiler running */
  public running = false;
  /** The scene pahts */
  public pathList: string[] = [];
  /** Chalk watcher */
  private watcher?: chokidar.FSWatcher;
  /** Is the watcher ready with the initial loading */
  private watcherReady = false;
  /** Is the compiler generating code */
  private generatingCode = false;

  constructor(params: CompilerOptions) {
    this.dev = params.dev;
    this.watch = params.watch;
    this.compilerDir = params.compilerDir || ".rush-compiler";
    this.outputDir = "./dist";
    this.onStartOption = params.onStart;
  }


  /** (re)generates the compiler directory */
  private cleanCompileDir() {
    if (fs.existsSync(this.compilerDir)) {
      deleteSync(`${this.compilerDir}/**`);
    } else {
      fs.mkdirSync(this.compilerDir);
    }
    if (fs.existsSync(this.outputDir)) {
      deleteSync(`${this.outputDir}/**`);
    } else {
      fs.mkdirSync(this.outputDir);
    }
  }

  private onStartCallback(err: Error, stats: WebpackStats) {
    if (this.generatingCode) return;
    if (err) {
      console.error(err.stack || err);
      if (err.message) {
        console.error(err.message);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    if (this.onStartOption) {
      this.onStartOption(err, stats);
    }
  }

  public async start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.cleanCompileDir();
    await this.getRoutes(this.watch);
    this.webpackInstance = webpack(
      generateWebpackConfig({
        mode: this.dev ? 'development' : 'production',
        outputDir: this.outputDir,
        compilerDir: this.compilerDir
      }),
      this.onStartCallback.bind(this)
    );
  }

  public async getRoutes(watch: boolean): Promise<string[]> {
    return new Promise((resolve) => {
      this.watcherReady = false
      this.pathList = []
      const watcher = chokidar.watch('./src/app/scenes/**/*.scene.tsx', {
        ignored: /(^|[\/\\])\../,
        persistent: true
      });
      this.watcher = watcher;
      watcher
        .on('add', path => {
          this.pathList.push(path)
          if (this.watcherReady) {
            this.generateCode()
          }
        })
        .on('ready', async () => {
          this.watcherReady = true;
          if (!watch) {
            watcher.close();
          }
          await this.generateCode()
          resolve(this.pathList)
        })
      if (watch) {
        // handle file deletions
        watcher.on('unlink', path => {
          const index = this.pathList.indexOf(path);
          if (index !== -1) {
            this.pathList.splice(index, 1);
          }
          this.generateCode()
        })
      }
    })
  }

  private async generateCode() {
    this.generatingCode = true;
    const routes = parseRoutes(this.pathList);
    generateAppCode(this.compilerDir, routes)
    this.generatingCode = false;
  }
}
