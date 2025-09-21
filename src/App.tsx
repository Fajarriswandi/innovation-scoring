import { Provider } from 'react-redux';
import { store } from '@/store';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from '@/pages/routes';
import './App.css';

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}