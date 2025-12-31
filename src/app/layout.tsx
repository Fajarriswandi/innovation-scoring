'use client';

import '@ant-design/v5-patch-for-react-19';
import '@livekit/components-styles';
import 'antd/dist/reset.css';
import './globals.css';
import '@/assets/styles/global.scss';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { App } from 'antd';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add('loaded');
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <HelmetProvider>
          <Provider store={store}>
            <ConfigProvider>
              <App>
                {children}
              </App>
            </ConfigProvider>
          </Provider>
        </HelmetProvider>
      </body>
    </html>
  );
}

