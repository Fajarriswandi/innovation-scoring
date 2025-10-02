import '@ant-design/v5-patch-for-react-19';
import '@livekit/components-styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './App';
import 'antd/dist/reset.css';
import './index.css';
import '@/assets/styles/global.scss';
import { HelmetProvider } from 'react-helmet-async';
import { App } from 'antd';

const RootShell = () => (
  <HelmetProvider>
    <App>
      <RootApp />
    </App>
  </HelmetProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (import.meta.env.PROD) {
  root.render(
    <React.StrictMode>
      <RootShell />
    </React.StrictMode>
  );
} else {
  root.render(<RootShell />);
}
