const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  // The entry point file described above
  entry: "./src/app.js",
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
   plugins: [
    new Dotenv()
  ],
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: "eval-source-map",
};
