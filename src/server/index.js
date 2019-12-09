require('ignore-styles');

//Babel register es un hook de required() que nos permite hacer un bind() en tiempo real de cualquier paquete que necesitemos
require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react'],
});

require('asset-require-hook')({
  extensions: ['jpg', 'png', 'gif'],
  name: '/assets/[hash].[ext]',
});

require('./server.js');
