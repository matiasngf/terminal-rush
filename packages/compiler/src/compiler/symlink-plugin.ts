import * as fs from 'fs/promises';
import * as path from 'path';
import { Compiler } from 'webpack';
import symlinkDir from 'symlink-dir';

interface CreateSymlinkPluginOptions {
  target: string;
  symlink: string;
  /** Ensure the parent directory of the symlink exists */
  createDirs?: boolean;
  type?: 'file' | 'dir';
}

export class CreateSymlinkPlugin {
  private options: CreateSymlinkPluginOptions;

  constructor(options: CreateSymlinkPluginOptions) {
    this.options = options;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.afterEmit.tapPromise('CreateSymlinkPlugin', async () => {
      try {
        if (this.options.createDirs) {
          // Ensure the parent directory of the symlink exists
          await fs.mkdir(path.dirname(this.options.symlink), { recursive: true });
        }

        // Create the symlink
        await symlinkDir(this.options.target, this.options.symlink);
      } catch (err) {
        console.error('Failed to create symlink:', err);
        throw err; // Prevent webpack from running if symlink creation fails
      }
    });
  }
}
