# Ten cuidado con la configracion de VSCODE en este caso el default que teniamos va en contra de lo definido en las reglas de eslint como un formating correcto de arrow functions, comas, comillas entre otras cosas por eso definimos nuevas reglas en .vscode que es el workspace de este proyecto :).

# Tambien puede ser si tienes prettier que necesites configurarlo.

# 1. Para empezar vamos a separa el proyecto en 2 carpetas una llamada server y la otra frontend y colocamos sus respectivos archivos para cada lugar.

    .- Una vez ubicados lo archivos y actualizado los import y la ubicacion de los archivos en webpack.config.js, procedemos a crear 2 archivos en el server un index.js para configuracion de dependencias y un server.js donde vive la configuracion del servidor.

    .-Instalamos @babel/register, express, nodemon y dotenv con npm o yarn , el flag -E nos permite conservar la version que usamos -D es para   install as developer dependenci.

    npm i babel-register express dotenv nodemon -D -E

    .-Procedemos con la configuracion de las dependencias en index.js y luego a configurar el server en server.js

    .- creamos en la ruta padre del proyecto un archivo llamado .env que contendra variables de entorno para la aplicacion debe ser agregado al git ignore para despliegue o produccion.

    .-Ahora crearemos el script para usar nuestro servidor de express en packge.json

# 2. Configurando ESLint, es una herramienta que nos señala el código que no cumpla con los estándares que le indiquemos. Se configura desde un .eslintrc. Debemos instalar las siguientes dependencias:

    yarn add babel-eslint eslint eslint-config-airbnb eslint-plugin-jsx-a11y eslint-loader eslint-plugin-import eslint-plugin-react

    npm install eslint-loader --save-dev

    .- ahora vamos a configurar en .eslintrc las reglas que queremos usar
    .- luego tenemos que configurar webpack con eslint agregando el eslint-loader
    .- por ultimo vamos a verificar que se cumplen las reglas de eslint en nuestro proyecto y a corregir los errores.

# 3. Preparación de Webpack, Babel, PostCSS y Assets.

    .- Vamos a pasar a babel en .babelrc el entorno que vamos a trabajar:

    "env": {
    "development": {
      "plugins": [
        "transform-class-properties", // clases en jsx
        "react-hot-loader/babel", // carga dinamica de contenido
        "babel-plugin-transform-object-assign"
      ]
    }

    .- ahora vamos al webpack.config.js y configuramos los asests añadiendo ciertas funcinalidades al css para que pueda ejecutar en cualquier navegador en este caso los prefijos. Con postCss y autoprefixer.

    const autoprefixer = require('autoprefixer');
    -Que es un plugin y  lo configuramos en webpack.config.js primero la regla del module:{} y luego en plugins:[]
    como una opcion extra el auto prefixer.

# 4. Usando Plugins y vendor file en Webpack, el vendor files es una estrategia que contiene todas nuestras dependencias del proyecto para poder separa los node modules de nuestros assest normales de nuestro navegador para poder cachearlos sin ningun problema.

    .-importamos: const webpack = require('webpack') en webpack.config.js
    .- corregismo si tenemos errores.
    .- agregamos la configuracion de postcss que esta en el archivo postcss.config.js
    .- ahora configuraremos los vendor files que van en webpak.config.js como un objeto llamado
    optimization:{
        .........
    }
    .- de ultimo configuramos el uso del HotModuleReplacementPlugin()

# 5. Integración de Webpack con Express para ello vamos al archivo server.js y configuramos.

    .-import webpack from 'webpack';
    .- Validamos si estamos en el entorno de development porque?; porque vamos a usar el hotmoduleremplacement y solo puede ser usado en produccion. con:

    if(ENV === 'development'){
        ...........
        //aqui tambien requerimos los paquetes que funcionaran solo en lado de development

        const serverconfig = {
            .......
            //configuracion del servidor
        }
        //Usamos la config con
        app.use(Middleware(compiler,serverconfig))
        app.use(Middleware(compiler)
    }

    Asi configuramos webpack para servirlo del lado de express

# 6. Servir React con Express aqui quitaremos htmlwebpackplugin ya que lo serviremos con express.

    .-mode: process.env.NODE_ENV, //indicandole a webpack el modo en el que trabajaremos, si no le indicamos a nuestra app que estamos en modo de desarrollo en este caso puede presentar errores con las rutas.
    .-se modifico el path: del output para indicale done guardar los archivos de assets

# 7. Agregando variables de sass desde webpack

    .- se agrega configuracion para el sass-loader en webpack.config.js verifica la documentacion.

        {
            loader: 'sass-loader',
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
    .-Esto es lo mismo que hacer @import "./Var.scss" en el app.scss solo que desde webpack, por lo que o lo hacemos aqui wne webpack o lo hacemos en los archivos de scss pero nunca en ambas partes. el archivo app.scss fue renombrado a base.scss

# 8. Aplicando history y creando rutas para el servidor Vamos a instalar la dependencia history para poder crear un historial del navegador desde el servidor, para agregar funcionalidades desde react-router.

    .-yarn add history --exact

    .- luego en el archivo index.js del fronend ubicado en la carpeta util agregamos

    import { Router } from 'react-router';
    import { createBrowserHistory } from 'history';

    .- como la usamos? const history = createBrowserHistory(); y luego
      <Router history={history}>
        <App />
      </Router>

    .-Ahora en app.js tenemos que preparar las rutas para nuestro servidor como hacemos esto ?
    creamos otro archivo llamado serverRoutes que lo importaremos en app.js y este nos servira para crear un array de objetos(rutas) el cual va a ser igual a la misma camtidad de rutas que tenemos definidas.
    Este objeto tendra las propiedades que esta ecibiendo nuestro componente de react

# 9. Haciendo initialState accesible y configurando Redux DevTools

    .-acomodamos el initialState en otro archivo y se estaba usando en index.js hasta ser removido
    .- configuramos redux-dev-tools de los navegadores
    https://github.com/zalmoxisus/redux-devtools-extension

    .- Como usarlo o comunicar la app con esta DevTool necesitamos destructurar compose en la app y llamar un composeEnhacers ve el archivo src/frontned/utils/index.js
    .- por ultimo lo habilitamos en las extensiones del navegador
    .-Pero como sabes que hasta ahora nuestra app esta renderizado del lado del cliente bueno desabilitamos javascript e el navegador y como vemos la app no cargar a continuacion implementaremos en server side rendering

# 10. Definiendo la función main para renderizado desde el servidor, de momento ya nuestra aplicación es servida por Node.js a través de Express, llegó el momento de empezar a renderizar nuestro sitio del lado del servidor.

Los dos elementos clave para esto son:

    .-El método renderToString de react-dom/server que tal como dice su nombre, va a convertir un componente de React a String puro, lo va a renderizar.
    .-El StaticRouter de react-router con el cual podemos crear un enrutador que no cambie de location.

    .-Definimos una carpeta routes en el servidor donde el archivo main.js contendra las rutas a renderizar
    .-{ renderToString } permite renderizar el component o app de react en un string
    .-No necesitamos configurar redux-dev-tools desde el lado de servidor.
    .-{ StaticRouter } como react-router no tiene como tal una ruta en el servidor que nos permite hacer static router por eso usamos esto.
    .-Instalamos react-router-config nos permite es tener un metodo render-routes donde renderizaremos las rutas del staticRouter. importamos { renderRoutes } en el archivo
    .- import a las rutas del servidor desde  import Routes from '../../frontend/routes/serverRoutes';
    .- importamos el Layout para que no halla diferencias entre el server y el cliente
    .- importamos los reducers y el initialState.

    .-Ahora vamos a definir la funcion main que nos ayudara a renderizar todo nuestra app.
    .-Vamos a crear un helper en la carpeta render del server como index.js el cual nos permitira reutilizar codigo asi en el archivo del servidor podemos usar multiples templates en vez de anclar la logica a uno solo. ejemplo si tenemos 2 boudles.
    .-Finalmente lo importamos en este archivo. Esta es la estructura basica.
    .- El main.js es la ruta y el Render va a ser el que renderiza la app de react.

# 11. Aplicando la función main para renderizado desde el servidor y creación del string de HTML

    .-como desde el lado del servidor no podemos usar ojas de estilo tenemos que llamar e instalar una dependencia llamada ignore-Styles, asi ignoramos los estilos con un hook desde el lado del servidor.
    Donde la llamamos desde el index.js principal del servidor
    .- <div id="app">${html}</div> del archivo index.js de la carpeta render del servidor estamo llamando el html para hacer el SSR.

# 12. Assets require hook Nuestro sitio actualmente presenta un problema con la carga de imágenes si le desactivas el JavaScript, para resolver esto vamos a instalar asset-require-hook lo que nos va a permitir indicarle al servidor donde se encuentran los assets de nuestra aplicación.

    .- yarn add asset-requiere-hook y lo requerimos en el index.js principal del server

# 13. Hydrate y estado de Redux desde Express, hydrate lo que hace es bind a los eventos y llama a todos los eventos disponibles en el navegador para que no tengamos que llamar 2 veces el mismo contnido.

    .- esto lo usamos en el index.js principal del fronted este simple cambio mejora mucho la experiencia de nuestra app el performance.
    .- tambien para evitar mandar 2 veces los estados, usaremos el preloadedState.
    Este es usado en el index.js pero es implementado en la carpeta render del server en el archivo index asi:

    <body>
        <div id="app">${html}</div>
        //ESTE SCRIPT ES MI PRELOADER QUE USA HYDRATE
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c'
          )}
        </script>

        <script src="${
          files ? files['main.js'] : 'assets/app.js'
        }" type="text/javascript"></script>
        <script src="${
          files ? files['vendors.js'] : 'assets/vendor.js'
        }" type="text/javascript"></script>
      </body>

      .-Para mas informacion ve la documentacion de redux en su pagina oficial
      .- es aqui mismo donde dejamos de usar nuestro initialState para remplazarlo con el preloadedState

      .-HASTA ESTE PUNTO LA APP YA ESTA CON SSR ES INDEXABLE CON BUSCADORES, TIENE UN LOOK AND FEEL MAS RAPDIO UNA MEJOR EXPERIENCIA DE USUARIO A CONTINUACION APLICAREMOS CIERTAS MEDIDAS PARA AL PASAR DE DE DEVELOP A PRODUCCION U OTRO PODAMOS HACER CAMBIOS SIN NINGUN PROBLEMA.

# 14. Configurando nuestro servidor para producción, Helmet nos va a ayudar con la seguridad de nuestro servidor. Simplemente lo instalamos con yarn add helmet --exact y lo pasamos como middleware a Express.

    .-Instalamos helmet y vamos al archivo del server para importarlo y hacer algunas configuraciones.
    .-Ahora vamos a crear una carpeta publica del lado del servidor para el uso del mismo, la cual agregaremos(ruta o llamada) en server.js ya que en produccio no estamos usando el hotModuleRemplacemente para que los assets sean servidos en esta carpeta publica y el server pueda usar estos assets.

# 15. Configurando el frontend y webpack para producción, para esto debemos evitar que se carguen por ejemplo las redux-dev-tools para produccion o el cliente de la app.

    .-Vamos al frondend/utils/index.js en el ccual debemos configurar que queremos que se cargue o no en modo de produccion. lineas 13,14,15 de ese archivo.
    .-Ahora vamos a configurar webpack llamamos a dotenv, porque aveces es necesario requerir dotenv en diferentes rutas
    .-Hay que definir a demas un devtool d webpack ve la documentacion hay info importante como si sirve para produccion o no, velocidad, codigo mimificado, estrategias,etc.
    .-En este caso usaremos una estrategia para produccion ve el archivo de webpack.config.js linea 13,16.
    .-Tambien evaluaremos el mode: process.env.NODE_ENV
    .-El path inicial va a ser diferente al que etamos trabajando ahorita como lo hacemos:

        path: isProd ? path.join(process.cwd(), './src/server/public') : '/',

    .- Ahora vamos a instalar:  (Nos ayuda a mimificar los archivos de la app)

        npm i terser-webpack-plugin -D

    .- Lo importamos en el archivo e webpack ve su documentacion de github hay salen los pasos para implementarlo, y usamos el isprod y preguntamos si es produccion o development

    .-HASTA AQUI YA TENEMOS WEBPACK Y EL SERVIDO PREPARADO PARA PRODUCCION AHORA SOLO FALTA COMPRIMIR LOS ASSETS PARA QUE EL NAVEGADOR LOS CARGUE MAS RAPIDO.

# 16. Compresión de Assets Vamos a optimizar el tamaño de nuestros assets con el compression-webpack-plugin, para ello lo instalamos con el siguiente comando: (Nota hay diferentes estrategias para implementacion)

    .- yarn add compression-webpack-plugin --exact

    .-importamos en webpack y hacemos la validadcion de si es pro o dev. lineas 132 - 139 de webpack.config.js usamos expresiones regulares claro para buscar los archivos que vamos a comprimir.
    .-Tambien es importante definir el nombre del archivo.
    .-para indicarle que estamos en production devemos cambiarlo en el archivo de .env

        NODE_ENV=development
                a
        NODE_ENV=production

    .-Siguiente vamos a configurar nuestro webpack para que pueda servir a produccion. En package.json en la build:

        "build": "webpack-cli --config webpack.config.js --colors"

    .- Y el script de produccion:

        "start:prod": "node src/server/index.js"

    .- Los Archivos comprimidos como gz reducen mucho el pese de se archivo haciendo la app mucho mas rapida en carga del navegador. Al momento de hacer diploiment en produccion es realmente cuando se va usar esto archivos por motivos practicos los dejaremos alli de momento.

# 17. Hashes vamos a agregar esta estrategia y como implementarlo en los archivos de la app para que el navegador no cachee esta info y el usuario tenga la ultima version de la app.

    .-Vamos a la config de webpack y agregamos una config extra en filename: lineas 21,130 de webpack.config.js
    .-ya que el hash es un identificador unico
    .-luego de esto recuerda agregar al .gitignore las carpetas con los assets para que no se suban a github.
    .-Ahora en render/index.js estabamos llamando a los archivos estaticos de los estilos css pero como config esto para produccion y development bueno usamos un helper que estara en un archivo llamado getManifest.js, que hace este bueno crear un archivo de manifiesto indicando donde estan nuestros assets.

    .-para esto necesitamos instalar un:
        npm install --save-dev webpack-manifest-plugin

    .-tambien hay que inportar y configurar en webpack.config.js linea 138
    .-Ahora creamos el archivo getManifest.js este es un metodo mas artesanal, que otros plugin como htmlwebpackplugin que ya inserta todo por defecto.
    .-llamamos el getmanifest en server/render/index.js
    .-Ahora alli mismo hacemos los ultimos cambios.

Cierre del Curso

¡Felicitaciones por terminar el Curso de Server Side Render

Tu aplicación ya se renderiza del lado del servidor y sigue buenas prácticas
para producción. Lo que sigue es añadirle mayor interactividad en el Curso de
Integración Backend y Frontend. Recuerda presentar el examen y dejar una review.

Sabemos que ha sido un largo camino, pero estamos seguros de que valió la pena.
Y recuerda, ¡nunca pares de aprender!
