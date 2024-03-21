import path from 'path';
import { Configuration, IgnorePlugin, NormalModuleReplacementPlugin, ProvidePlugin } from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import nodeExternals from "webpack-node-externals";

export type CompileMode = "development" | "production";

const libsToExcludeFromCompilation = [
  "@terminal-rush/compiler",
  "webpack",
  "webpack-virtual-modules",
  "webpack-node-externals",
  "handlebars",
  "express",
  "@swc/core",
  "swc-loader",
  "ts-loader",
  "fork-ts-checker-webpack-plugin",
  "react-devtools-core",
  // "ink",
  "react",
  "asciify-image",
  "ink-use-stdout-dimensions",
  "commander",
  "canvas",
  "node-canvas-webgl",
  "bufferutil",
  // "headless-gl",
  "jsdom",
  // "node-canvas-webgl/lib/index",
  "three",
]

const loggedLibs = new Set();

interface GenerateWebpackConfigOptions {
  /** Compile mode */
  mode: CompileMode;
  /** Dir where the final app will be built */
  outputDir: string
  /** Dir to be used by the compiler itself */
  compilerDir: string;
}

export const generateWebpackConfig = ({
  mode,
  outputDir,
  compilerDir
}: GenerateWebpackConfigOptions) => {
  const config: Configuration = {
    entry: path.resolve("./src/cli.ts"),
    mode,
    watch: mode === "development",
    target: 'node',
    externalsPresets: { node: true },
    externals: [nodeExternals({
      allowlist: (modulePath) => {
        if (!loggedLibs.has(modulePath)) {
          loggedLibs.add(modulePath);

          if (!(libsToExcludeFromCompilation.includes(modulePath))) {
            console.log(`Compiling module: ${modulePath}`);
          }

        }
        return !(libsToExcludeFromCompilation.includes(modulePath));
      }
    })],
    output: {
      path: path.resolve(outputDir),
      filename: 'cli.js',
      globalObject: "this"
    },
    module: {
      rules: [
        {
          test: /\.(jsx?)|(tsx?)$/,
          exclude: /node_modules/,
          include: [
            path.resolve("./src"),
            path.resolve(compilerDir),
          ],
          use: "babel-loader"
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          type: 'asset/inline',
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        "@router": [path.resolve(compilerDir, "project-routes")],
        "@": path.resolve("./src"),
        // 'ink': path.resolve("./node_modules/ink/build/index.js"),
      }
    },
    experiments: {
      topLevelAwait: true
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: [path.resolve(outputDir)],
      }),
      // new NormalModuleReplacementPlugin(
      //   /bindings\/bindings\.js$/,
      //   path.resolve(__dirname, "static/bindings.js")
      // ),

      new ForkTsCheckerWebpackPlugin(),
      new ProvidePlugin({
        "React": "react",
      }),
    ]
  }


  // Fix issues with importing unsupported fsevents module in Windows and Linux
  // For more info, see: https://github.com/vinceau/project-clippi/issues/48
  if (process.platform !== "darwin") {
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^fsevents$/,
      })
    );
  }

  return config;
}
