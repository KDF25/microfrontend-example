const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const pkg = require("./package.json");

/** Account remote. Mirror of catalog's config; only names/ports differ. */
module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const publicPath = process.env.PUBLIC_PATH || "auto";

  return {
    entry: "./src/index.ts",
    mode: argv.mode || "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "assets/[name].[contenthash:8].js" : "assets/[name].js",
      publicPath,
      clean: true,
      uniqueName: "account",
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
      new ModuleFederationPlugin({
        name: "account",
        filename: "remoteEntry.js",
        exposes: {
          "./AccountApp": "./src/AccountApp",
        },
        shared: {
          react: { singleton: true, requiredVersion: pkg.dependencies.react },
          "react-dom": {
            singleton: true,
            requiredVersion: pkg.dependencies["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: pkg.dependencies["react-router-dom"],
          },
        },
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
    ],
    devServer: {
      port: 3002,
      historyApiFallback: true,
      hot: true,
      open: false,
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  };
};
