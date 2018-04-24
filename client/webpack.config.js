var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': path.resolve(__dirname, './public')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          configFile: './.eslintrc.json'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /\/fonts\//,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[hash:7].[ext]',
          publicPath: './dist/'
        }
      },
      {
        test: /\.woff2$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash:7].[ext]',
          publicPath: './dist/'
        }
      },
      {
        test: /\.(ttf|eot|woff)$/,
        loader: 'file-loader',
        options: {
          name: '../fonts/[name].[hash:7].[ext]',
          emitFile: false
        }
      },
      {
        test: /\/fonts\/.*\.svg$/,
        loader: 'file-loader',
        options: {
          name: '../fonts/[name].[hash:7].[ext]',
          emitFile: false
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl$/,
        loader: ['style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  let date = new Date()
  let year = date.getFullYear()
  let dateSplit = date.toISOString().split(/T|\./)
  let timestamp = `${dateSplit[0]} ${dateSplit[1]} UTC`
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        SERVICE_URL: JSON.stringify('https://rocsafe.inov.pt')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      },
      comments: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.BannerPlugin(
      `Copyright (C) ${year} INOV INESC INOVACAO\n` +
      `${process.env.npm_package_name} v${process.env.npm_package_version} ${timestamp}`
    )
  ])
} else {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        SERVICE_URL: JSON.stringify('http://localhost:8081')
      }
    })
  ])
}
