const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const { resolve } = require('path');

module.exports = function (options, webpack) {
  const isProduction = process.env.NODE_ENV === 'production';
  const dotenvFile = isProduction ? './.env.production' : './.env.development';

  return {
    ...options,
    mode: isProduction ? 'production' : 'development', // Set Webpack mode
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
      new DotenvWebpackPlugin({
        path: dotenvFile,
        safe: true, // Recommended: Check .env files against .env.example
        allowEmptyValues: true, // Optional: Allow empty values
        // systemvars: true, // Optional: Fallback to system environment variables
      }),
    ],
  };
};
