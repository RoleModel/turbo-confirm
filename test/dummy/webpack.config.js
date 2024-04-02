import path from 'path'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

let mode = 'development'

if (process.env.RAILS_ENV === 'production' || process.env.CI === 'true') {
  mode = 'production'
}

export default {
  mode,
  devtool: 'source-map',
  entry: {
    application: [
      './app/javascript/application.js',
      './app/assets/stylesheets/application.scss'
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve('app/assets/builds')
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\/icons\/.*.svg$/,
        type: 'asset/source'
      },
      {
        test: /\.(jpg|jpeg|png|gif|tiff|ico|eot|otf|ttf|woff|woff2)$/i,
        use: 'asset/resource'
      },
      {
        test: /\.(mjs|cjs|js|jsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2021'
        },
        // ES Module has stricter rules than CommonJS, so file extensions must be
        // used in import statements. To ease migration from CommonJS to ESM,
        // uncomment the fullySpecified option below to allow Webpack to use a
        // looser set of rules. Not recommend for new projects or the long term.
        resolve: {
          // Allows importing JS files without specifying the file extension.
          fullySpecified: false
        }
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: mode === 'production',
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    // Extract CSS into its own file for the Rails asset pipeline to pick up
    new MiniCssExtractPlugin(),

    // We're compiling all JS to a single application.js file
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
  ].filter(Boolean)
}
