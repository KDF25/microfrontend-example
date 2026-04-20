const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const pkg = require("./package.json");

/**
 * Catalog remote.
 *
 *   - `name: "catalog"` — the global this remote registers as on window.
 *   - `filename: "remoteEntry.js"` — the entry file the host fetches.
 *   - `exposes: { "./CatalogApp": ... }` — the import paths the host uses.
 *
 * Standalone dev: `pnpm --filter catalog dev` serves the remote's own shell
 * at :3001 so we can develop & test the remote without running the host.
 */
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
      uniqueName: "catalog",
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
        name: "catalog",
        filename: "remoteEntry.js",
        exposes: {
          "./CatalogApp": "./src/CatalogApp",
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
      new CopyWebpackPlugin({
        patterns: [{ from: "public/img", to: "img", noErrorOnMissing: true }],
      }),
    ],
    devServer: {
      port: 3001,
      historyApiFallback: true,
      hot: true,
      open: false,
      // Required so the host on :3000 can fetch remoteEntry.js cross-origin.
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  };
};
