const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const pkg = require("./package.json");

/**
 * Host is the shell. At runtime it loads `catalog` and `account` remotes by
 * fetching their `remoteEntry.js` and mounting the exposed React trees into
 * routed outlets.
 *
 * Remote URLs are read from env vars at build time so the same image can run
 * in dev (localhost:3001/3002) or in prod (CloudFront domains). In a more
 * advanced setup we'd flip to dynamic remotes (read URLs from a runtime
 * manifest) — see MENTOR_NOTES.md.
 */
module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  const catalogUrl = process.env.CATALOG_URL || "http://localhost:3001";
  const accountUrl = process.env.ACCOUNT_URL || "http://localhost:3002";

  return {
    entry: "./src/index.ts",
    mode: argv.mode || "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "assets/[name].[contenthash:8].js" : "assets/[name].js",
      publicPath: "auto",
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
      new ModuleFederationPlugin({
        name: "host",
        remotes: {
          catalog: `catalog@${catalogUrl}/remoteEntry.js`,
          account: `account@${accountUrl}/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true, requiredVersion: pkg.dependencies.react, eager: false },
          "react-dom": {
            singleton: true,
            requiredVersion: pkg.dependencies["react-dom"],
            eager: false,
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: pkg.dependencies["react-router-dom"],
            eager: false,
          },
        },
      }),
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
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  };
};
