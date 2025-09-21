import { Layout } from 'antd';

const { Content } = Layout;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f0f2f5',
          padding: 24,
        }}
      >
        <div style={{ width: 360 }}>{children}</div>
      </Content>
    </Layout>
  );
}