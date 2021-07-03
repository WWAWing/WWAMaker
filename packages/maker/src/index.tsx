import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, StoreType } from './State';

import "./load/LoadMessages";
import "./wwadata/WWADataMessages";

import "semantic-ui-css/semantic.min.css";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WhyDidYouRender from "@welldone-software/why-did-you-render";

ReactDOM.render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

if (process.env.NODE_ENV === "development") {
    WhyDidYouRender(React, {
        trackHooks: false
    });
}

declare module "react-redux" {
    interface DefaultRootState extends StoreType {}
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
