const config = {
  devtool: "inline-source-map",

  entry: "./src/main/index.ts",

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