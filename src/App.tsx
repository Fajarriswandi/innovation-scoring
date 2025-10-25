import { Provider } from 'react-redux';
import { store } from '@/store';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from '@/pages/routes';
import './App.css';
import InboundCallProvider from '@/features/livecall/components/InboundCallProvider';
import InboundCallWidgetContainer from '@/features/livecall/components/InboundCallWidgetContainer';

export default function RootApp() {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <InboundCallProvider />
          <AppRoutes />
          <InboundCallWidgetContainer />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
