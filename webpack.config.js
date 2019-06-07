// Used only as a workaround for error when building forwardEmail function that relies on mailjet

const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
};
