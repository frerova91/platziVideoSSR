import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import reducer from './reducers';
import App from './routes/App';

//Validando  si la app existe en nuestro servidor o en el cliente, esto es necesario ya que se usara en srr casi a diario; ya que por lo general necesitamos hacer binding a evenetos que solo existen en el objeto window (eje: localStorage, no hay este en el servidor). Lo cual puede romper la aaplicacion
if (typeof window !== 'undefined') {
  //configuradon redux-dev-tools
  let composeEnhacers;
  if (process.env.NODE_ENV === 'production') composeEnhacers = compose;
  else composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  //Estados de la app en SSR
  const preloadedState = window.__PRELOADED_STATE__;
  const store = createStore(reducer, preloadedState, composeEnhacers());
  //usando react-router
  const history = createBrowserHistory();

  hydrate(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
}
