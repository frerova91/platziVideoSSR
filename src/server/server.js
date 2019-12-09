import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import main from './routes/main';
import helmet from 'helmet';

//CONFIG EVIROMENTS VARIABLES
dotenv.config();

//CONFIG (PRODUCTION / DEVELOPMENT)
const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;

//CONFIG EXPRESS SERVER
const app = express();
//Configurando carpeta publica del servidor
app.use(express.static(`${__dirname}/public`));

//CONFIG SERVER ENVIROMENT+SERVER_CONFIG AND PLUGINS REQUIREMENTS
if (ENV === 'development') {
  console.log('Loading dev config');
  //Es importante requerirlos aqui yya que estos no lo usaremos en el lado de produccion.
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  //Compilador llamado con webpack
  const compiler = webpack(webpackConfig);
  //Config del Server
  const serverConfig = {
    contentBase: `http://localhost${PORT}`,
    port: PORT,
    //el publicPath configurados en la config de webpack
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    //para que funcione necesitasmos esto.
    historyApiFallback: true,
    stats: { colors: true },
  };
  //Usando la configuracion
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  //Indicando el modo ..... (produccion en este caso)
  console.log(`Loading ${ENV} config`);
  //Usando helmet
  app.use(helmet());
  //Aplicando algunas politicas de Seguridad de Helmet para Produccion
  app.use(helmet.permittedCrossDomainPolicies());
  //Este evita conocer que tipo de servidor se esta usando node,jango u otro.
  app.disable('x-powered-by');
}

//RUTES FOR SERVER, LLAMANDO A LA APP
app.get('*', main);

//INIT EXPRESS SERVER
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server runding on ${PORT}`);
});
