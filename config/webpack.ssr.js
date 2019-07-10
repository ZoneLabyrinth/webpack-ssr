
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const argv = require('yargs-parser')(process.argv.slice(2))

const _mode = process.env.NODE_ENV || 'development'

const _modeflag = process.env.NODE_ENV === 'production ' ? true : false

//webpack优化
// 提示框
const WebpackBuildNotifyerPlugin = require('webpack-build-notifier')
// 进度条
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// dashboard
// const DashboardPlugin = require('webpack-dashboard/plugin')
// 打包速度
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const ASSET_PATH = process.env.ASSET_PATH || './';
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')





const setMPA = () => {
    const entry = {};
    const HtmlWebpackPlugins = [];

    //修改serverjs
    const entryFiles = glob.sync(path.join(__dirname,'../src/*/index-server.js'))


    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];


        const match = entryFile.match(/src\/(.*)\/index-server\.js/)

        const pageName = match && match[1];

        if(pageName) {

          entry[pageName] = entryFile;

          HtmlWebpackPlugins.push(
              new HtmlWebpackPlugin({
                  // filename:'index.html',
                  template: path.resolve(__dirname, `../src/${pageName}/index.html`),
                  filename: `${pageName}.html`,
                  chunks:[pageName]
              }),
          )
        }
    })
    return {
        entry,
        HtmlWebpackPlugins
    }
}

const {entry,HtmlWebpackPlugins} = setMPA()

module.exports = {
    entry,
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name]-server.js',
      libraryTarget: 'umd'
      // publicPath: './'
    },
    mode:'none',
    module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              'babel-loader'
            ]
          },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: ()=>[
                                require('autoprefixer')({
                                    browsers: ['last 2 version','>1%','ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpg)$/,
                use: 'file-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    resolve:{
        alias: {
            "@": path.resolve(__dirname,"../src/components"),
            "src":path.resolve(__dirname,"../src")
        }
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 chunks: 'initial',
    //                 name: 'common',
    //                 minChunks: 1,
    //                 maxInitialRequests: 5,
    //                 minSize: 0
    //             }
    //         }
    //     },

    //     //加了这个无法使用
    //     // runtimeChunk: {
    //     //     name: 'manifest'
    //     // }
    // },
    plugins: [
        new CleanWebpackPlugin(),
    
        //压缩css
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }]
          },
          canPrint: true
        }),
        // new UglifyJSPlugin({
        //   sourceMap: true
        // }),
        new MiniCssExtractPlugin({
          filename: _modeflag ? 'styles/[name].[hash:5].css' : 'styles/[name].css',
          chunkFilename: _modeflag ? 'styles/[id].[hash:5].css' : 'styles/[id].css'
        }),
        new WebpackBuildNotifyerPlugin({
            title:'my-ssr',
            suppressSuccess:true
        }),
        new ProgressBarPlugin(),
        // new DashboardPlugin()
        new ManifestPlugin()
    ].concat(HtmlWebpackPlugins)
}


