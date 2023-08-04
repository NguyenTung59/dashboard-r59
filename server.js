const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"

  }
}).listen(5000, '192.168.14.165', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at 192.168.14.165:5000');
});
