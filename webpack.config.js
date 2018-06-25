const config = {
  devtool: "nline-source-map",

  entry: "./src/index.ts",

  output: {
    filename: "bundle.js",
  },

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader"}
    ]
  }
};

module.exports =  config;