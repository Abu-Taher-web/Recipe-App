const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/js/index.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/bundle.js'
    },

    devServer:{
        open: true,
        contentBase:'./dist'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }
        )

        // [
        //   "@babel/plugin-transform-runtime",
        //   {
        //     "regenerator": true,
        //     "corejs": 3 // or 2; if polyfills needed
        //     ...
        //   }
        // ]
      ],
      
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                //presets: ['@babel/preset-env']
                //presets: [ [ "@babel/preset-env", { "targets": { "esmodules": true } } ] ] 
                presets: [
                  ["@babel/preset-env", {
                    "useBuiltIns": "usage",
                    "corejs": 3, // or 2,
                    "targets": {
                        "firefox": "64", // or whatever target to choose .    
                    },
                  }]
                ]
              }
            }
          }
        ]
      }
      
}
