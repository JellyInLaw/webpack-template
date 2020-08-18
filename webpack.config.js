const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const sassLoader = require("sass-loader");

//vars
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

//function
const optimization = () => {
  const config = { splitChunks: { chunks: "all" } };
  if (isProd) {
    config.minimizer = [new TerserPlugin(), new OptimizeCssAssetsPlugin()];
  }
  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
      },
    },
    "css-loader",
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

//modules
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: ["@babel/polyfill", "./index.js"],
    subMain: "./js/analytics.js",
  },
  output: {
    filename: "js/" + filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  optimization: optimization(),
  devServer: { port: "8081", hot: isDev },
  devtool: isDev ? "source-map" : "",
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: { collapseWhitespace: isProd },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: filename("css") }),
    new CopyPlugin({
      patterns: [{ from: "./favicon.ico", to: "" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
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
