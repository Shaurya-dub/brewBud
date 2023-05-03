const path = require("path");
const dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = () => {
    const env = dotenv.config().parsed;

    // Create an object from the environment variables
    const envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});
  return {
    // The entry point file described above
    entry: "./src/app.js",
    // The location of the build folder described above
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    },

    plugins: [new webpack.DefinePlugin(envKeys)],
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: "eval-source-map",
  };
};
