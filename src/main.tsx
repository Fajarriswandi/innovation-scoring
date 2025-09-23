import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './App';
import 'antd/dist/reset.css';
import './index.css';
import '@/assets/styles/global.scss';
import { HelmetProvider } from 'react-helmet-async';
import { App } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App>
        <RootApp />
      </App>
    </HelmetProvider>
  </React.StrictMode>
);