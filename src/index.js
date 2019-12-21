import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Popper from 'popper.js';

window.$ = window.jQuery = require('jquery')  // Required for Bootstrap
window.Popper = Popper
require('bootstrap')

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
