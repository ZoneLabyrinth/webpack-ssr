const express = require('express')
const webpack = require('webpack')
const path = require('path')
const webapckDevMidddleWare = require('webpack-dev-middleware')
const webpackDevServer = require('webpack-dev-server')

const app = express();
const config = require('../webpack.config.js');
const compiler = webpack(config)
const options = {
    contentBase: path.resolve(__dirname,'dist'),
    hot:true,
    port:3000
}

webpackDevServer.addDevServerEntrypoints(config,options);
const server = new webpackDevServer(compiler,options)


//使用中间件
// app.use(webapckDevMidddleWare(compiler,{
//     publicPath:config.output.publicPath
// }))


server.listen(3000,function(){
    console.log('Example app listening on port 3000: \n')
})