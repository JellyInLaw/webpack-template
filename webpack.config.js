const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./index.js",
    analytics: "./analytics.js",
  },
  output: {
    filename: "js/[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: { splitChunks: { chunks: "all" } },
  devServer: { port: "8081", hot: isDev },
  plugins: [
    new HTMLWebpackPlugin({ template: "./index.html" }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new CopyPlugin({
      patterns: [{ from: "./assets/favicon.ico", to: "" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img",
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: "file-loader",
        options: {
          outputPath: "fonts",
        },
      },
    ],
  },
};
