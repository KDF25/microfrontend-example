const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @param {any} env @param {{mode?: string}} argv */
module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: "./src/index.tsx",
    mode: argv.mode || "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "assets/[name].[contenthash:8].js" : "assets/[name].js",
      publicPath: "/",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: { "@": path.resolve(__dirname, "src") },
    },
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
        { test: /\.svg$/, type: "asset/resource" },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new CopyWebpackPlugin({
        patterns: [{ from: "public/img", to: "img", noErrorOnMissing: true }],
      }),
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: false,
    },
  };
};
