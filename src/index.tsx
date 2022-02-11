import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

declare global {
  interface Window {
    ethereum: {
      chainId: string;
      on: (eventName: string, cb: (ev: never) => void) => void;
      removeListener: (eventName: string, cb: (ev: never) => void) => void;
      request: (params: unknown) => void;
      autoRefreshOnNetworkChange: boolean;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.unregister();
