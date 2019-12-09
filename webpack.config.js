const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

//llamando a el archivo .env
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'cheap-source-map',
  entry: './src/frontend/index.js',
  mode: process.env.NODE_ENV, //indicandole a webpack el modo en el que trabajaremos
  output: {
    path: isProd ? path.join(process.cwd(), './src/server/public') : '/',
    filename: isProd ? 'assets/app-[hash].js' : 'assets/app.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  // Estos son los Vendor Files
  optimization: {
    minimizer: isProd ? [new TerserPlugin()] : [],
    splitChunks: {
      //config
      chunks: 'async',
      name: true,
      cacheGroups: {
        // definiendo el vendor
        vendors: {
          name: 'vendors',
          chunks: 'all',
          //garantiza la reutilizacion de codigo
          reuseExistingChunk: true,
          // si debe o no ejecutarse primero que el boundle de react
          priority: 1,
          //nombre del archivo final
          filename: isProd ? 'assets/vendor-[hash].js' : 'assets/vendor.js',
          enforce: true,
          //config para que el archivo vendor se obtenga unicamente de los node modules, es decir toma todos los import de boundle de react y lo va  a pasar a otra parte.
          test(module, chunks) {
            const name = module.nameForCondition && module.nameForCondition();
            return chunks.some(
              (chunks) =>
                chunks.name !== 'vendor' && /[\\/]node_modules[\\/]/.test(name)
            );
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: {
          loader: 'eslint-loader', // evita que se ejecute la app hasta que se corrijan los errores
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            //config el sass-loader para importar los archivos principales de scss
            options: {
              data: `
                @import "${path.resolve(
                  __dirname,
                  'src/frontend/assets/styles/Vars.scss'
                )}";
                @import "${path.resolve(
                  __dirname,
                  'src/frontend/assets/styles/Media.scss'
                )}";
                @import "${path.resolve(
                  __dirname,
                  'src/frontend/assets/styles/Base.scss'
                )}";
              `,
            },
          },
        ],
      },
      {
        test: /\.(png|gif|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        //loader de postcss
        postcss: [autoprefixer()],
      },
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? 'assets/app-[hash].css' : 'assets/app.css',
    }),
    isProd
      ? new CompressionPlugin({
          test: /\.js$|\.css$/,
          filename: '[path].gz',
        })
      : () => {},
    isProd ? new ManifestPlugin() : () => {},
  ],
};
