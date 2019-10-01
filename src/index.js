import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createVirtualElement, renderDom} from './render'

let virtualDom = renderDom(createVirtualElement('ul', {class: 'list'}, [
  createVirtualElement('li', {class: 'item'}, ['周杰伦']),
  createVirtualElement('li', {class: 'item'}, ['林俊杰']),
  createVirtualElement('li', {class: 'item'}, ['王力宏'])
]))



ReactDOM.render(<App />, document.getElementById('root'));
document.getElementById('root').appendChild(virtualDom)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
