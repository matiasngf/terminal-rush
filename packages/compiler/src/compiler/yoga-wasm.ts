import { Compiler } from "webpack";
import path from "path";
import fs from "fs";

export class YogaWasmPathPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapAsync('YogaWasmPathPlugin', (compilation, callback) => {
      const outputPath = compilation.outputOptions.path;
      if (!outputPath) {
        console.error('Output path is undefined');
        callback();
        return;
      }

      const cliPath = path.resolve(outputPath, 'cli.js');


      fs.readFile(cliPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading cli.js:', err);
          callback();
          return;
        }

        // Add path import at the beginning of the file
        let result = "#!/usr/bin/env node\n";
        result += "const path = require('path');\n";
        result += data;

        // Replace the absolute path with a path.resolve using __dirname
        result = result.replace(
          /\(0,i\.createRequire\)\("file:\/\/\/.*?yoga-wasm-web\/dist\/node\.js"\)\.resolve\("\.\/yoga\.wasm"\)/g,
          'path.resolve(__dirname, "yoga.wasm")'
        );

        fs.writeFile(cliPath, result, (err) => {
          if (err) {
            console.error('Error writing cli.js:', err);
          } else {
            console.log('Successfully updated cli.js');
          }
          callback();
        });
      });
    });
  }
}
